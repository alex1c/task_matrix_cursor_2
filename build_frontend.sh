#!/bin/bash

echo "🔨 Собираем фронтенд на сервере..."

# Переходим в директорию проекта
cd /var/www/eisenhower-matrix

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Не найден package.json. Проверьте директорию."
    exit 1
fi

echo "✅ Находимся в директории проекта: $(pwd)"

# Проверяем наличие frontend директории
if [ ! -d "frontend" ]; then
    echo "❌ Папка frontend не найдена!"
    exit 1
fi

echo "✅ Папка frontend найдена"

# Устанавливаем зависимости для корневого проекта
echo "📦 Устанавливаем зависимости корневого проекта..."
npm install

# Устанавливаем зависимости для frontend
echo "📦 Устанавливаем зависимости frontend..."
cd frontend
npm install
cd ..

# Устанавливаем зависимости для backend
echo "📦 Устанавливаем зависимости backend..."
cd backend
npm install
cd ..

# Собираем фронтенд
echo "🔨 Собираем фронтенд..."
cd frontend
npm run build
cd ..

# Проверяем, что dist создался
if [ ! -d "frontend/dist" ]; then
    echo "❌ Папка frontend/dist не создалась!"
    echo "Проверяем содержимое frontend:"
    ls -la frontend/
    exit 1
fi

echo "✅ Фронтенд собран успешно!"
echo "📁 Содержимое frontend/dist:"
ls -la frontend/dist/

# Устанавливаем права доступа
echo "🔐 Устанавливаем права доступа..."
sudo chown -R www-data:www-data /var/www/eisenhower-matrix/frontend/dist/
sudo chmod -R 755 /var/www/eisenhower-matrix/frontend/dist/

# Проверяем права доступа
echo "📋 Проверяем права доступа:"
ls -la frontend/dist/

# Перезапускаем Apache
echo "🔄 Перезапускаем Apache..."
sudo systemctl restart apache2

# Проверяем статус Apache
echo "📊 Статус Apache:"
sudo systemctl status apache2 --no-pager -l

echo "✅ Готово! Проверьте сайт: https://todolist.su/"
echo "📁 Фронтенд собран в: /var/www/eisenhower-matrix/frontend/dist/"
