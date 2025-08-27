#!/bin/bash

echo "🔧 Исправляем проблему с Apache..."

# Проверяем, что файлы существуют
echo "📁 Проверяем файлы..."
if [ ! -f "/var/www/eisenhower-matrix/frontend/dist/index.html" ]; then
    echo "❌ index.html не найден!"
    exit 1
fi

echo "✅ Файлы на месте"

# Перезапускаем Apache
echo "🔄 Перезапускаем Apache..."
sudo systemctl restart apache2

# Ждем немного
sleep 3

# Проверяем статус Apache
echo "📊 Статус Apache:"
sudo systemctl status apache2 --no-pager -l

# Проверяем логи
echo "📋 Последние логи:"
sudo tail -5 /var/log/apache2/error.log

# Проверяем, что бэкенд запущен
echo "🔍 Проверяем бэкенд..."
if ! pm2 list | grep -q "eisenhower-backend"; then
    echo "🔄 Запускаем бэкенд..."
    cd /var/www/eisenhower-matrix
    pm2 start ecosystem.config.js
    pm2 save
else
    echo "✅ Бэкенд уже запущен"
fi

# Проверяем порт 3000
echo "🔍 Проверяем порт 3000..."
if ss -tlnp | grep -q ":3000"; then
    echo "✅ Порт 3000 активен"
else
    echo "❌ Порт 3000 не активен"
fi

# Тест локального доступа
echo "🌐 Тест локального доступа:"
curl -I http://localhost/ 2>/dev/null || echo "❌ Локальный доступ не работает"

# Тест API
echo "🔌 Тест API:"
curl -s http://localhost:3000/api/tasks 2>/dev/null | head -c 100 || echo "❌ API не отвечает"

echo ""
echo "✅ Исправление завершено!"
echo "🌐 Проверьте сайт: https://todolist.su/"
