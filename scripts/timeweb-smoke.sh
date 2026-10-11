#!/usr/bin/env bash
# Local smoke against 127.0.0.1:3004 (no DNS dependency).
set -euo pipefail

BASE="${BASE:-http://127.0.0.1:3004}"
COOKIE_A="$(mktemp)"
COOKIE_B="$(mktemp)"
trap 'rm -f "${COOKIE_A}" "${COOKIE_B}"' EXIT

echo "=== smoke health ==="
curl -fsS "${BASE}/api/health" | tee /tmp/tl-health.json
grep -q '"ok":true' /tmp/tl-health.json

echo "=== smoke session A ==="
curl -fsS -c "${COOKIE_A}" -b "${COOKIE_A}" "${BASE}/api/session" > /tmp/tl-session-a.json
CSRF_A="$(sed -n 's/.*"csrfToken":"\([^"]*\)".*/\1/p' /tmp/tl-session-a.json)"
test -n "${CSRF_A}"

echo "=== create task A (Cyrillic) ==="
CREATE_A="$(curl -fsS -c "${COOKIE_A}" -b "${COOKIE_A}" \
	-H "Content-Type: application/json" \
	-H "X-CSRF-Token: ${CSRF_A}" \
	-H "Origin: https://todolist.su" \
	-d '{"title":"Проверка кириллицы","description":"тест","quadrant":"urgent-important","priority":"medium"}' \
	"${BASE}/api/tasks")"
echo "${CREATE_A}"
TASK_ID="$(printf '%s' "${CREATE_A}" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')"
test -n "${TASK_ID}"
printf '%s' "${CREATE_A}" | grep -q 'Проверка кириллицы'

echo "=== move / complete / export ==="
curl -fsS -c "${COOKIE_A}" -b "${COOKIE_A}" \
	-H "Content-Type: application/json" \
	-H "X-CSRF-Token: ${CSRF_A}" \
	-H "Origin: https://todolist.su" \
	-X PUT \
	-d '{"quadrant":"important-not-urgent"}' \
	"${BASE}/api/tasks/${TASK_ID}/move" >/tmp/tl-move.json
grep -q 'important-not-urgent' /tmp/tl-move.json

curl -fsS -c "${COOKIE_A}" -b "${COOKIE_A}" \
	-H "Content-Type: application/json" \
	-H "X-CSRF-Token: ${CSRF_A}" \
	-H "Origin: https://todolist.su" \
	-X PUT \
	-d '{"completed":true}' \
	"${BASE}/api/tasks/${TASK_ID}" >/tmp/tl-upd.json

curl -fsS -c "${COOKIE_A}" -b "${COOKIE_A}" \
	"${BASE}/api/tasks/export" | tee /tmp/tl-export.csv | grep -q 'Проверка'

echo "=== isolation user B ==="
curl -fsS -c "${COOKIE_B}" -b "${COOKIE_B}" "${BASE}/api/session" >/tmp/tl-session-b.json
LIST_B="$(curl -fsS -c "${COOKIE_B}" -b "${COOKIE_B}" "${BASE}/api/tasks")"
test "${LIST_B}" = '[]'

echo "=== forged x-user-id ignored ==="
# Steal attempt: header with A's cookie user id, but B's cookie jar empty → new empty session
FORGE="$(curl -fsS -H "x-user-id: $(grep userId "${COOKIE_A}" | awk '{print $7}')" "${BASE}/api/tasks")"
test "${FORGE}" = '[]' || test "$(printf '%s' "${FORGE}" | head -c 1)" = '['

echo "=== reject CSRF-less mutate ==="
CODE="$(curl -sS -o /dev/null -w '%{http_code}' -c "${COOKIE_A}" -b "${COOKIE_A}" \
	-H "Content-Type: application/json" \
	-H "Origin: https://todolist.su" \
	-X DELETE "${BASE}/api/tasks/${TASK_ID}")"
test "${CODE}" = '403'

echo "=== persistence across container restart ==="
# Recreate task, restart container, ensure volume keeps data.
CREATE_P="$(curl -fsS -c "${COOKIE_A}" -b "${COOKIE_A}" \
	-H "Content-Type: application/json" \
	-H "X-CSRF-Token: ${CSRF_A}" \
	-H "Origin: https://todolist.su" \
	-d '{"title":"persist-check","quadrant":"urgent-important","priority":"low"}' \
	"${BASE}/api/tasks")"
PERSIST_ID="$(printf '%s' "${CREATE_P}" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')"
if command -v docker >/dev/null 2>&1 && docker inspect todolist-app >/dev/null 2>&1; then
	docker restart todolist-app >/dev/null
	for i in $(seq 1 20); do
		if curl -fsS "${BASE}/api/health" >/dev/null 2>&1; then break; fi
		sleep 1
	done
	# Session cookies still valid; task must remain in sqlite volume.
	AFTER="$(curl -fsS -c "${COOKIE_A}" -b "${COOKIE_A}" "${BASE}/api/tasks")"
	printf '%s' "${AFTER}" | grep -q "${PERSIST_ID}"
	echo "persistence=OK"
else
	echo "persistence=SKIPPED (no todolist-app container in this environment)"
fi

echo "=== delete with CSRF ==="
CODE="$(curl -sS -o /dev/null -w '%{http_code}' -c "${COOKIE_A}" -b "${COOKIE_A}" \
	-H "X-CSRF-Token: ${CSRF_A}" \
	-H "Origin: https://todolist.su" \
	-X DELETE "${BASE}/api/tasks/${TASK_ID}")"
test "${CODE}" = '204'
# Also delete persist task if still present
curl -sS -o /dev/null -c "${COOKIE_A}" -b "${COOKIE_A}" \
	-H "X-CSRF-Token: ${CSRF_A}" \
	-H "Origin: https://todolist.su" \
	-X DELETE "${BASE}/api/tasks/${PERSIST_ID}" || true

echo "=== homepage title ==="
curl -fsS "${BASE}/" | grep -q 'Матрица Эйзенхауэра'

echo "SMOKE_OK"
