#!/bin/bash

# Скрипт для деплоя Eisenhower Matrix приложения
echo "🚀 Начинаем деплой Eisenhower Matrix приложения..."

# Остановка PM2 процессов
echo "⏹️ Останавливаем существующие процессы..."
pm2 stop eisenhower-backend 2>/dev/null || true
pm2 delete eisenhower-backend 2>/dev/null || true

# Установка зависимостей
echo "📦 Устанавливаем зависимости..."
npm run install:all

# Сборка фронтенда
echo "🔨 Собираем фронтенд..."
cd frontend
npm run build
cd ..

# Запуск бэкенда через PM2
echo "🔄 Запускаем бэкенд..."
pm2 start ecosystem.config.js

# Сохранение PM2 конфигурации
echo "💾 Сохраняем PM2 конфигурацию..."
pm2 save

# Настройка автозапуска PM2
echo "🔧 Настраиваем автозапуск PM2..."
pm2 startup

echo "✅ Деплой завершен!"
echo "📊 Статус процессов:"
pm2 status

