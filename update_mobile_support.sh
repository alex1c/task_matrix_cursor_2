#!/bin/bash

echo "📱 Обновляем приложение с улучшенной поддержкой мобильных устройств..."

cd /var/www/eisenhower-matrix

# Останавливаем бэкенд
echo "⏹️ Останавливаем бэкенд..."
pm2 stop eisenhower-backend

# Собираем фронтенд
echo "🔨 Собираем фронтенд..."
cd frontend
npm run build
cd ..

# Проверяем, что сборка прошла успешно
if [ ! -d "frontend/dist" ]; then
    echo "❌ Ошибка сборки фронтенда!"
    exit 1
fi

echo "✅ Фронтенд собран успешно"

# Устанавливаем права доступа
echo "🔐 Устанавливаем права доступа..."
sudo chown -R www-data:www-data /var/www/eisenhower-matrix/frontend/dist/
sudo chmod -R 755 /var/www/eisenhower-matrix/frontend/dist/

# Запускаем бэкенд
echo "🔄 Запускаем бэкенд..."
pm2 start eisenhower-backend

# Сохраняем PM2 конфигурацию
echo "💾 Сохраняем PM2 конфигурацию..."
pm2 save

# Перезапускаем Apache
echo "🔄 Перезапускаем Apache..."
sudo systemctl restart apache2

# Проверяем статус
echo "📊 Проверяем статус..."
echo "PM2 статус:"
pm2 status

echo "Apache статус:"
sudo systemctl status apache2 --no-pager -l

echo ""
echo "✅ Обновление завершено!"
echo "📱 Улучшения для мобильных устройств:"
echo "   - Улучшенная поддержка touch событий"
echo "   - Альтернативное меню перемещения задач"
echo "   - Оптимизированные стили для мобильных экранов"
echo "   - Улучшенная визуальная обратная связь"
echo ""
echo "🌐 Проверьте сайт: https://todolist.su/"
echo "📱 Протестируйте на мобильном устройстве!"
