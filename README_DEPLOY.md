# Деплой Eisenhower Matrix на Ubuntu сервер

## Предварительные требования

-   Ubuntu 20.04+ сервер
-   SSH доступ к серверу
-   Домен (опционально, но рекомендуется)

## Пошаговая инструкция

### 1. Подключение к серверу

```bash
ssh username@your-server-ip
```

### 2. Обновление системы

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Установка Node.js и npm

```bash
# Установка Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка версий
node --version
npm --version
```

### 4. Установка PM2

```bash
sudo npm install -g pm2
```

### 5. Установка Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 6. Настройка файрвола

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 7. Загрузка проекта на сервер

#### Вариант A: Через Git (рекомендуется)

```bash
# Создание директории для проекта
sudo mkdir -p /var/www/eisenhower-matrix
sudo chown $USER:$USER /var/www/eisenhower-matrix

# Клонирование репозитория
cd /var/www
git clone https://github.com/your-username/eisenhower-matrix.git
cd eisenhower-matrix
```

#### Вариант B: Через SCP

```bash
# На локальной машине
scp -r ./eisenhower-matrix username@your-server-ip:/var/www/
```

### 8. Настройка Nginx

```bash
# Копирование конфигурации
sudo cp nginx.conf /etc/nginx/sites-available/eisenhower-matrix

# Создание символической ссылки
sudo ln -s /etc/nginx/sites-available/eisenhower-matrix /etc/nginx/sites-enabled/

# Удаление дефолтного сайта
sudo rm /etc/nginx/sites-enabled/default

# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
```

### 9. Настройка SSL (опционально, но рекомендуется)

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com

# Автоматическое обновление сертификатов
sudo crontab -e
# Добавить строку: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 10. Деплой приложения

```bash
cd /var/www/eisenhower-matrix

# Сделать скрипт исполняемым
chmod +x deploy.sh

# Запуск деплоя
./deploy.sh
```

### 11. Проверка работы

```bash
# Проверка статуса PM2
pm2 status

# Проверка логов
pm2 logs eisenhower-backend

# Проверка Nginx
sudo systemctl status nginx
```

## Управление приложением

### Перезапуск приложения

```bash
pm2 restart eisenhower-backend
```

### Просмотр логов

```bash
pm2 logs eisenhower-backend
```

### Обновление приложения

```bash
cd /var/www/eisenhower-matrix
git pull
./deploy.sh
```

### Остановка приложения

```bash
pm2 stop eisenhower-backend
```

## Мониторинг

### Установка PM2 Monitor

```bash
pm2 install pm2-server-monit
```

### Просмотр мониторинга

```bash
pm2 monit
```

## Резервное копирование

### Создание бэкапа базы данных

```bash
# Создание директории для бэкапов
mkdir -p /var/backups/eisenhower-matrix

# Скрипт для бэкапа
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp /var/www/eisenhower-matrix/backend/database.sqlite /var/backups/eisenhower-matrix/database_$DATE.sqlite
find /var/backups/eisenhower-matrix -name "*.sqlite" -mtime +7 -delete
EOF

chmod +x backup.sh

# Добавление в cron (ежедневный бэкап в 2:00)
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/eisenhower-matrix/backup.sh") | crontab -
```

## Устранение неполадок

### Проверка портов

```bash
sudo netstat -tlnp | grep :5000
sudo netstat -tlnp | grep :80
```

### Проверка логов

```bash
# Nginx логи
sudo tail -f /var/log/nginx/eisenhower_error.log

# PM2 логи
pm2 logs eisenhower-backend --lines 100
```

### Перезапуск всех сервисов

```bash
sudo systemctl restart nginx
pm2 restart all
```

## Безопасность

### Обновление зависимостей

```bash
npm audit fix
```

### Настройка файрвола

```bash
sudo ufw status
sudo ufw allow from your-ip-address
```

## Производительность

### Оптимизация Nginx

```bash
# Добавление в /etc/nginx/nginx.conf
worker_processes auto;
worker_connections 1024;
```

### Мониторинг ресурсов

```bash
htop
df -h
free -h
```

