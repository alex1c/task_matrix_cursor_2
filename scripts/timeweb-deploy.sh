#!/usr/bin/env bash
# Deploy todolist.su on Timeweb safely (no peer impact, no DNS changes, no prune).
set -euo pipefail

TARGET_IP="${TARGET_IP:-188.225.26.192}"
APP_DIR="${APP_DIR:-/var/www/todolist}"
COMPOSE_FILE="docker-compose.timeweb.yml"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
REPORT="/tmp/todolist-timeweb-deploy-${STAMP}.txt"
RELEASE_SHA="${RELEASE_SHA:-unknown}"

log() { echo "$@" | tee -a "${REPORT}"; }

: > "${REPORT}"
log "=== TODOLIST TIMEWEB DEPLOY ==="
log "UTC=${STAMP}"
log "hostname=$(hostname)"
log "RELEASE_SHA=${RELEASE_SHA}"
log "TARGET_IP=${TARGET_IP}"

# --- preflight: peer containers must stay running ---
log ""
log "=== PREFLIGHT PEERS ==="
for name in first-calc calc1-app pipetkaonline-app; do
	if docker inspect "${name}" >/dev/null 2>&1; then
		st="$(docker inspect "${name}" --format '{{.State.Status}}')"
		log "peer ${name} status=${st}"
		if [ "${st}" != "running" ]; then
			log "ERROR: peer ${name} not running. STOP."
			exit 1
		fi
	else
		log "WARN: peer ${name} not found by name"
	fi
done

# Refuse if something unexpected already owns 3004
if ss -lnt | grep -q '127.0.0.1:3004'; then
	owner="$(docker ps --format '{{.Names}} {{.Ports}}' | grep '3004' || true)"
	if echo "${owner}" | grep -q 'todolist-app'; then
		log "port 3004 already used by todolist-app (recreate allowed)"
	elif [ -n "${owner}" ]; then
		log "ERROR: port 3004 owned by unexpected process: ${owner}"
		exit 1
	else
		log "ERROR: port 3004 is listening but not by todolist-app"
		exit 1
	fi
else
	log "port 3004 is free"
fi

# Snapshot protected apache checksums
BEFORE_SUMS="$(mktemp)"
find /etc/apache2/sites-enabled /etc/apache2/sites-available -maxdepth 1 -type f \
	\( -name '*calc1*' -o -name '*first-calc*' -o -name '*pipetka*' -o -name '*otatu*' -o -name '*qr-pr*' -o -name '*receptvmeste*' \) \
	-print0 2>/dev/null | sort -z | xargs -0 sha256sum 2>/dev/null | tee "${BEFORE_SUMS}" | tee -a "${REPORT}" || true

# --- deploy app files ---
log ""
log "=== DEPLOY APP ==="
mkdir -p "${APP_DIR}"
# Release tarball expected at /tmp/todolist-release.tgz
if [ ! -f /tmp/todolist-release.tgz ]; then
	log "ERROR: /tmp/todolist-release.tgz missing"
	exit 1
fi
rm -rf "${APP_DIR:?}/"*
tar -xzf /tmp/todolist-release.tgz -C "${APP_DIR}"
cd "${APP_DIR}"
test -f "${COMPOSE_FILE}"
test -f .env.timeweb
test -f Dockerfile

# Build and recreate ONLY the todolist compose project.
# No prune. No down -v. No touching other compose projects.
docker compose -f "${COMPOSE_FILE}" --env-file .env.timeweb build
docker compose -f "${COMPOSE_FILE}" --env-file .env.timeweb up -d --force-recreate --no-deps todolist

# Wait for health
for i in $(seq 1 30); do
	if curl -fsS "http://127.0.0.1:3004/api/health" >/dev/null 2>&1; then
		log "health=OK attempt=${i}"
		break
	fi
	if [ "${i}" -eq 30 ]; then
		log "ERROR: health check failed"
		docker inspect todolist-app --format 'status={{.State.Status}} exit={{.State.ExitCode}} error={{.State.Error}}' 2>&1 | tee -a "${REPORT}" || true
		docker compose -f "${COMPOSE_FILE}" logs --no-color --tail=120 todolist 2>&1 | tee -a "${REPORT}" || true
		exit 1
	fi
	sleep 2
done

# --- Apache vhost (HTTP) ---
log ""
log "=== APACHE VHOST ==="
install -d -m 755 /etc/apache2/sites-available
cp -f "${APP_DIR}/deploy/apache/todolist.su.conf" /etc/apache2/sites-available/todolist.su.conf
a2enmod proxy proxy_http headers rewrite >/dev/null
a2ensite todolist.su.conf >/dev/null
apachectl configtest 2>&1 | tee -a "${REPORT}"
systemctl reload apache2
log "apache reload=OK"

# Integrity of peer configs
AFTER_SUMS="$(mktemp)"
find /etc/apache2/sites-enabled /etc/apache2/sites-available -maxdepth 1 -type f \
	\( -name '*calc1*' -o -name '*first-calc*' -o -name '*pipetka*' -o -name '*otatu*' -o -name '*qr-pr*' -o -name '*receptvmeste*' \) \
	-print0 2>/dev/null | sort -z | xargs -0 sha256sum 2>/dev/null | tee "${AFTER_SUMS}" | tee -a "${REPORT}" || true
if ! cmp -s "${BEFORE_SUMS}" "${AFTER_SUMS}"; then
	log "ERROR: protected Apache configs changed"
	diff -u "${BEFORE_SUMS}" "${AFTER_SUMS}" | tee -a "${REPORT}" || true
	exit 1
fi
log "protected_configs_unchanged=yes"
rm -f "${BEFORE_SUMS}" "${AFTER_SUMS}"

# --- curl --resolve HTTP checks ---
log ""
log "=== CURL --RESOLVE HTTP ==="
for host in todolist.su www.todolist.su; do
	code="$(curl -sS -o /tmp/tl-body.html -w '%{http_code}' --resolve "${host}:80:${TARGET_IP}" "http://${host}/")"
	title="$(tr '\n' ' ' < /tmp/tl-body.html | sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p')"
	health="$(curl -sS --resolve "${host}:80:${TARGET_IP}" "http://${host}/api/health")"
	log "host=${host} http=${code} title=${title}"
	log "health=${health}"
done

# --- optional certbot only if public DNS already points here ---
resolve_via() {
	local name="$1" server="$2"
	dig +time=3 +tries=1 +short A "${name}" "@${server}" 2>/dev/null | awk '/^[0-9.]+$/{print; exit}'
}

log ""
log "=== DNS / OPTIONAL SSL ==="
apex_cf="$(resolve_via todolist.su 1.1.1.1)"
apex_gg="$(resolve_via todolist.su 8.8.8.8)"
www_cf="$(resolve_via www.todolist.su 1.1.1.1)"
www_gg="$(resolve_via www.todolist.su 8.8.8.8)"
log "dns todolist.su cf=${apex_cf:-UNRESOLVED} google=${apex_gg:-UNRESOLVED}"
log "dns www.todolist.su cf=${www_cf:-UNRESOLVED} google=${www_gg:-UNRESOLVED}"

if [ "${apex_cf}" = "${TARGET_IP}" ] && [ "${apex_gg}" = "${TARGET_IP}" ] \
	&& [ "${www_cf}" = "${TARGET_IP}" ] && [ "${www_gg}" = "${TARGET_IP}" ]; then
	log "dns_ok_for_certbot=yes"
	if command -v certbot >/dev/null 2>&1; then
		set +e
		certbot --apache --non-interactive --agree-tos --redirect --keep-until-expiring \
			-d todolist.su -d www.todolist.su 2>&1 | tee -a "${REPORT}"
		cert_rc=${PIPESTATUS[0]}
		set -e
		log "certbot_rc=${cert_rc}"
		ssl_conf="/etc/apache2/sites-available/todolist.su-le-ssl.conf"
		if [ "${cert_rc}" -eq 0 ] && [ -f "${ssl_conf}" ]; then
			if ! grep -q 'X-Forwarded-Proto' "${ssl_conf}"; then
				sed -i '/ProxyPass/i\\tRequestHeader set X-Forwarded-Proto "https"' "${ssl_conf}"
			fi
			apachectl configtest 2>&1 | tee -a "${REPORT}"
			systemctl reload apache2
			log "ssl_forwarded_proto=https"
		fi
	else
		log "certbot missing; SSL skipped"
	fi
else
	log "WAITING_FOR_DNS SSL=SKIPPED (keep HTTP vhost; do not force certificates)"
fi

# --- smoke tests against 127.0.0.1:3004 ---
log ""
log "=== LOCAL SMOKE ==="
SMOKE_SCRIPT="${APP_DIR}/scripts/timeweb-smoke.sh"
if [ -x "${SMOKE_SCRIPT}" ] || [ -f "${SMOKE_SCRIPT}" ]; then
	bash "${SMOKE_SCRIPT}" 2>&1 | tee -a "${REPORT}"
else
	log "WARN: smoke script missing"
fi

# Peer HTTPS smoke
log ""
log "=== PEER SMOKE ==="
for url in \
	'https://first-calc.com/' \
	'https://calc1.ru/' \
	'https://pipetkaonline.ru/' \
	'http://otatu.ru/' \
	'http://qr-pr.ru/' \
	'http://receptvmeste.ru/'
do
	set +e
	code="$(curl -sS -o /dev/null -w '%{http_code}' -L --max-redirs 5 --connect-timeout 10 "${url}")"
	rc=$?
	set -e
	log "peer url=${url} curl_rc=${rc} http=${code}"
done

log ""
log "docker_ps_todolist=$(docker ps --filter name=todolist-app --format '{{.Names}} {{.Status}} {{.Ports}}')"
log "apache_sites=$(ls /etc/apache2/sites-enabled | tr '\n' ' ')"
log "TODOLIST_DEPLOY_DONE"
cat "${REPORT}"
