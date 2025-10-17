#!/bin/bash

# Простой скрипт для автоматического запуска todolist.su после перезагрузки сервера
# Автор: AI Assistant
# Дата: $(date)

echo "🚀 Запуск приложения todolist.su..."

# 1. Остановить Nginx (если запущен)
echo "📦 Остановка Nginx..."
sudo systemctl stop nginx 2>/dev/null || true

# 2. Запустить Apache
echo "🌐 Запуск Apache..."
sudo systemctl start apache2
sudo systemctl enable apache2

# 3. Перейти в каталог проекта
cd /var/www/eisenhower-matrix

# 4. Убить все процессы Node.js (если есть)
echo "🔄 Остановка старых процессов Node.js..."
sudo pkill -9 node 2>/dev/null || true

# 5. Запустить бэкенд
echo "⚙️ Запуск бэкенда..."
cd backend
sudo -u www-data nohup node server.js > /var/log/eisenhower-matrix/backend.log 2>&1 &
BACKEND_PID=$!
echo "Бэкенд запущен с PID: $BACKEND_PID"

# 6. Подождать немного
sleep 3

# 7. Проверить, что бэкенд работает
echo "🔍 Проверка бэкенда..."
if curl -s http://localhost:5000/api/tasks > /dev/null; then
    echo "✅ Бэкенд работает!"
else
    echo "❌ Бэкенд не отвечает!"
    exit 1
fi

# 8. Проверить Apache
echo "🔍 Проверка Apache..."
if curl -s -I http://localhost/ | grep -q "200 OK"; then
    echo "✅ Apache работает!"
else
    echo "❌ Apache не отвечает!"
    exit 1
fi

# 9. Проверить сайт
echo "🔍 Проверка сайта..."
if curl -s -I http://localhost/ | grep -q "301\|200"; then
    echo "✅ Сайт доступен!"
else
    echo "❌ Сайт недоступен!"
    exit 1
fi

echo ""
echo "🎉 ВСЕ ГОТОВО!"
echo "📱 Сайт доступен по адресу: https://todolist.su/"
echo "🔧 Бэкенд работает на порту: 5000"
echo "🌐 Apache работает на порту: 80/443"
echo ""
echo "📋 Статус сервисов:"
echo "   Apache: $(systemctl is-active apache2)"
echo "   Nginx: $(systemctl is-active nginx 2>/dev/null || echo 'stopped')"
echo "   Бэкенд: $(ps aux | grep 'node server.js' | grep -v grep | wc -l) процесс(ов)"
echo ""
