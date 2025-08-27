# Многоэтапная сборка
FROM node:18-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование package.json файлов
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Установка зависимостей
RUN npm run install:all

# Копирование исходного кода
COPY . .

# Сборка фронтенда
RUN cd frontend && npm run build

# Продакшн образ
FROM node:18-alpine AS production

# Установка рабочей директории
WORKDIR /app

# Копирование package.json файлов для бэкенда
COPY backend/package*.json ./backend/

# Установка только продакшн зависимостей для бэкенда
RUN cd backend && npm ci --only=production

# Копирование собранного фронтенда
COPY --from=builder /app/frontend/dist ./frontend/dist

# Копирование бэкенд кода
COPY backend ./backend

# Копирование конфигурации PM2
COPY ecosystem.config.js ./

# Установка PM2 глобально
RUN npm install -g pm2

# Создание пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Изменение владельца файлов
RUN chown -R nodejs:nodejs /app
USER nodejs

# Открытие порта
EXPOSE 3000

# Запуск приложения через PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
