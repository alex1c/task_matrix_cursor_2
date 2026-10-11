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

RUN apk add --no-cache wget \
	&& addgroup -S app && adduser -S app -G app

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/ ./
COPY --from=frontend-builder /frontend/dist ./public

RUN mkdir -p /app/data && chown -R app:app /app
USER app

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/app/data/database.sqlite
ENV FRONTEND_DIST=/app/public

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
	CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
