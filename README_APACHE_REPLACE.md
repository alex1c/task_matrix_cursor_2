# Замена существующего приложения на Eisenhower Matrix (Apache)

## 🎯 Цель

Заменить существующее приложение на Apache сервере на новое Eisenhower Matrix приложение.

## 📋 Предварительная подготовка

### 1. Проверка текущего состояния

```bash
# Проверка Apache статуса
sudo systemctl status apache2

# Проверка текущих сайтов
sudo apache2ctl -S

# Проверка занятых портов
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
```

### 2. Создание бэкапа текущего приложения

```bash
# Создание директории для бэкапов
sudo mkdir -p /var/backups/app-backups

# Бэкап текущего DocumentRoot
sudo cp -r /var/www/html /var/backups/app-backups/html-backup-$(date +%Y%m%d_%H%M%S)

# Бэкап Apache конфигурации
sudo cp /etc/apache2/sites-available/000-default.conf /var/backups/app-backups/apache-config-backup-$(date +%Y%m%d_%H%M%S)
```

## 🚀 Пошаговая замена

### Шаг 1: Загрузка проекта на сервер

#### Вариант A: Через Git

```bash
cd /tmp
git clone https://github.com/your-username/eisenhower-matrix.git
cd eisenhower-matrix
```

#### Вариант B: Через SCP (с локальной машины)

```bash
scp -r ./eisenhower-matrix username@your-server-ip:/tmp/
```

### Шаг 2: Запуск скрипта замены

```bash
cd /tmp/eisenhower-matrix

# Сделать скрипт исполняемым
chmod +x replace_app.sh

# Запуск замены
./replace_app.sh
```

### Шаг 3: Настройка домена (если нужно)

```bash
# Редактирование конфигурации Apache
sudo nano /etc/apache2/sites-available/eisenhower-matrix.conf

# Заменить your-domain.com на ваш домен
# ServerName your-domain.com
```

### Шаг 4: Перезапуск Apache

```bash
sudo systemctl restart apache2
```

## 🔧 Ручная настройка (если скрипт не работает)

### 1. Установка Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Установка PM2

```bash
sudo npm install -g pm2
```

### 3. Включение Apache модулей

```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo a2enmod expires
sudo a2enmod deflate
```

### 4. Настройка виртуального хоста

```bash
# Копирование конфигурации
sudo cp apache.conf /etc/apache2/sites-available/eisenhower-matrix.conf

# Отключение старого сайта
sudo a2dissite 000-default.conf

# Включение нового сайта
sudo a2ensite eisenhower-matrix.conf
```

### 5. Размещение файлов

```bash
# Создание директории
sudo mkdir -p /var/www/eisenhower-matrix
sudo chown $USER:$USER /var/www/eisenhower-matrix

# Копирование проекта
cp -r /tmp/eisenhower-matrix/* /var/www/eisenhower-matrix/

# Установка зависимостей и сборка
cd /var/www/eisenhower-matrix
npm run install:all
cd frontend && npm run build && cd ..
```

### 6. Запуск бэкенда

```bash
cd /var/www/eisenhower-matrix
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔍 Проверка работы

### 1. Проверка Apache

```bash
sudo systemctl status apache2
sudo apache2ctl configtest
```

### 2. Проверка PM2

```bash
pm2 status
pm2 logs eisenhower-backend
```

### 3. Проверка портов

```bash
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3000
```

### 4. Проверка в браузере

-   Откройте http://your-domain.com
-   Проверьте, что фронтенд загружается
-   Создайте тестовую задачу
-   Проверьте, что API работает

## 🔄 Откат изменений

### Если нужно вернуть старое приложение

```bash
# Остановка нового приложения
pm2 stop all
pm2 delete all

# Восстановление старой конфигурации Apache
sudo a2dissite eisenhower-matrix.conf
sudo a2ensite 000-default.conf

# Восстановление старого DocumentRoot
sudo rm -rf /var/www/html
sudo cp -r /var/backups/app-backups/html-backup-YYYYMMDD_HHMMSS /var/www/html

# Перезапуск Apache
sudo systemctl restart apache2
```

## 🛠️ Устранение неполадок

### Проблема: Apache не запускается

```bash
# Проверка конфигурации
sudo apache2ctl configtest

# Просмотр логов
sudo tail -f /var/log/apache2/error.log
```

### Проблема: PM2 не запускается

```bash
# Проверка логов
pm2 logs

# Перезапуск PM2
pm2 kill
pm2 start ecosystem.config.js
```

### Проблема: API не отвечает

```bash
# Проверка порта 3000
sudo netstat -tlnp | grep :3000

# Проверка логов бэкенда
pm2 logs eisenhower-backend

# Тест API напрямую
curl http://localhost:3000/api/tasks
```

### Проблема: Статические файлы не загружаются

```bash
# Проверка прав доступа
ls -la /var/www/eisenhower-matrix/frontend/dist/

# Установка правильных прав
sudo chown -R www-data:www-data /var/www/eisenhower-matrix/frontend/dist/
```

## 📊 Мониторинг

### Просмотр логов Apache

```bash
sudo tail -f /var/log/apache2/eisenhower_access.log
sudo tail -f /var/log/apache2/eisenhower_error.log
```

### Просмотр логов приложения

```bash
pm2 logs eisenhower-backend --lines 100
```

### Мониторинг ресурсов

```bash
# Использование памяти
free -h

# Использование диска
df -h

# Загрузка процессора
htop
```

## 🔒 Безопасность

### Настройка файрвола

```bash
sudo ufw allow ssh
sudo ufw allow 'Apache'
sudo ufw enable
```

### SSL сертификат (опционально)

```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d your-domain.com
```

## 📝 Полезные команды

### Управление Apache

```bash
sudo systemctl start apache2
sudo systemctl stop apache2
sudo systemctl restart apache2
sudo systemctl reload apache2
```

### Управление PM2

```bash
pm2 start ecosystem.config.js
pm2 stop eisenhower-backend
pm2 restart eisenhower-backend
pm2 delete eisenhower-backend
pm2 monit
```

### Обновление приложения

```bash
cd /var/www/eisenhower-matrix
git pull
cd frontend && npm run build && cd ..
pm2 restart eisenhower-backend
```
