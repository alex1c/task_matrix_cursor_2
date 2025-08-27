#!/bin/bash

# Скрипт для замены существующего приложения на Eisenhower Matrix
echo "🔄 Начинаем замену приложения на Eisenhower Matrix..."

# Проверка наличия Apache
if ! command -v apache2 &> /dev/null; then
    echo "❌ Apache не установлен. Установите Apache: sudo apt install apache2"
    exit 1
fi

# Остановка существующего приложения (если запущено через PM2)
echo "⏹️ Останавливаем существующие процессы..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Проверка и освобождение порта 3000
echo "🔍 Проверяем порт 3000..."
if [ -f "check_port_3000.sh" ]; then
    chmod +x check_port_3000.sh
    ./check_port_3000.sh
fi

# Создание бэкапа текущего приложения
echo "💾 Создаем бэкап текущего приложения..."
BACKUP_DIR="/var/backups/old-app-$(date +%Y%m%d_%H%M%S)"
sudo mkdir -p "$BACKUP_DIR"

# Бэкап текущего сайта
if [ -f "/etc/apache2/sites-available/000-default.conf" ]; then
    sudo cp /etc/apache2/sites-available/000-default.conf "$BACKUP_DIR/"
fi

# Бэкап DocumentRoot
if [ -d "/var/www/html" ]; then
    sudo cp -r /var/www/html "$BACKUP_DIR/"
fi

echo "✅ Бэкап сохранен в: $BACKUP_DIR"

# Установка Node.js (если не установлен)
if ! command -v node &> /dev/null; then
    echo "📦 Устанавливаем Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Установка PM2 (если не установлен)
if ! command -v pm2 &> /dev/null; then
    echo "📦 Устанавливаем PM2..."
    sudo npm install -g pm2
fi

# Включение необходимых Apache модулей
echo "🔧 Включаем Apache модули..."
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod expires
sudo a2enmod deflate

# Создание директории для нового приложения
echo "📁 Создаем директорию для приложения..."
sudo mkdir -p /var/www/eisenhower-matrix
sudo chown $USER:$USER /var/www/eisenhower-matrix

# Копирование файлов проекта (предполагается, что проект уже загружен)
echo "📋 Копируем файлы проекта..."
# Если проект в текущей директории:
if [ -f "package.json" ]; then
    cp -r . /var/www/eisenhower-matrix/
else
    echo "❌ Файлы проекта не найдены. Убедитесь, что вы находитесь в директории проекта."
    exit 1
fi

cd /var/www/eisenhower-matrix

# Установка зависимостей
echo "📦 Устанавливаем зависимости..."
npm run install:all

# Сборка фронтенда
echo "🔨 Собираем фронтенд..."
cd frontend
npm run build
cd ..

# Настройка Apache конфигурации
echo "⚙️ Настраиваем Apache..."
sudo cp apache.conf /etc/apache2/sites-available/eisenhower-matrix.conf

# Отключение дефолтного сайта
sudo a2dissite 000-default.conf

# Включение нового сайта
sudo a2ensite eisenhower-matrix.conf

# Проверка конфигурации Apache
echo "🔍 Проверяем конфигурацию Apache..."
sudo apache2ctl configtest

if [ $? -eq 0 ]; then
    echo "✅ Конфигурация Apache корректна"
else
    echo "❌ Ошибка в конфигурации Apache"
    exit 1
fi

# Запуск бэкенда через PM2
echo "🔄 Запускаем бэкенд..."
pm2 start ecosystem.config.js

# Сохранение PM2 конфигурации
echo "💾 Сохраняем PM2 конфигурацию..."
pm2 save

# Настройка автозапуска PM2
echo "🔧 Настраиваем автозапуск PM2..."
pm2 startup

# Перезапуск Apache
echo "🔄 Перезапускаем Apache..."
sudo systemctl restart apache2

# Проверка статуса
echo "📊 Проверяем статус сервисов..."
echo "Apache статус:"
sudo systemctl status apache2 --no-pager -l

echo "PM2 статус:"
pm2 status

echo "✅ Замена приложения завершена!"
echo "🌐 Приложение доступно по адресу: http://your-domain.com"
echo "📁 Бэкап старого приложения: $BACKUP_DIR"
