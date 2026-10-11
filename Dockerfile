# Single-image Timeweb deploy: Vite build + Express API on one port.
# Use Debian slim (glibc) so sqlite3 native bindings are stable (Alpine/musl segfaulted).
FROM node:18-bookworm-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build \
	&& if [ ! -d dist/messages ] && [ -d public/messages ]; then \
		mkdir -p dist/messages && cp -r public/messages/* dist/messages/; \
	fi

FROM node:18-bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends wget gosu ca-certificates python3 make g++ \
	&& rm -rf /var/lib/apt/lists/* \
	&& groupadd --system app \
	&& useradd --system --gid app --create-home app

COPY backend/package*.json ./
RUN npm ci --omit=dev && npm rebuild sqlite3

COPY backend/ ./
COPY --from=frontend-builder /frontend/dist ./public
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh \
	&& mkdir -p /app/data \
	&& chown -R app:app /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/data/database.sqlite
ENV FRONTEND_DIST=/app/public

EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=5s --start-period=40s --retries=6 \
	CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

USER root
ENTRYPOINT ["/docker-entrypoint.sh"]
