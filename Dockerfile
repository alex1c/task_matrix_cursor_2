# Single-image Timeweb deploy: Vite build + Express API on one port.
FROM node:18-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build \
	&& if [ ! -d dist/messages ] && [ -d public/messages ]; then \
		mkdir -p dist/messages && cp -r public/messages/* dist/messages/; \
	fi

FROM node:18-alpine AS runtime
WORKDIR /app

# su-exec drops privileges after fixing volume ownership on the bind/volume mount.
RUN apk add --no-cache wget su-exec \
	&& addgroup -S app && adduser -S app -G app

COPY backend/package*.json ./
RUN npm ci --omit=dev

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
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=6 \
	CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

# Start as root so entrypoint can chown the named volume, then drop to app.
USER root
ENTRYPOINT ["/docker-entrypoint.sh"]
