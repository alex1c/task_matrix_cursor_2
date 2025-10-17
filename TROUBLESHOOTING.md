# Устранение неполадок Eisenhower Matrix

## Быстрая диагностика

Запустите скрипт диагностики для выявления проблем:

```bash
# Полная диагностика
sudo ./debug-app.sh

# Быстрая проверка
sudo ./debug-app.sh quick

# Проверка логов
sudo ./debug-app.sh logs

# Проверка сети
sudo ./debug-app.sh network

# Проверка сервисов
sudo ./debug-app.sh services

# Тест бэкенда
sudo ./debug-app.sh test
```

## Частые проблемы и решения

### 1. Сервис не запускается

**Симптомы:**

-   `systemctl status eisenhower-matrix` показывает failed
-   Логи показывают ошибки запуска

**Диагностика:**

```bash
# Проверить статус сервиса
sudo systemctl status eisenhower-matrix

# Посмотреть логи
sudo journalctl -u eisenhower-matrix -n 50

# Проверить права доступа
ls -la /var/www/eisenhower-matrix/
```

**Решения:**

```bash
# 1. Проверить, что директория существует
sudo mkdir -p /var/www/eisenhower-matrix

# 2. Установить правильные права
sudo chown -R www-data:www-data /var/www/eisenhower-matrix
sudo chmod +x /var/www/eisenhower-matrix/start-app.sh

# 3. Переустановить сервис
sudo ./install-service.sh uninstall
sudo ./install-service.sh
```

### 2. Node.js не установлен

**Симптомы:**

-   Ошибка "Node.js is not installed"
-   Команда `node` не найдена

**Решение:**

```bash
# Установить Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs

# Проверить установку
node --version
npm --version
```

### 3. Зависимости не установлены

**Симптомы:**

-   Ошибки "Cannot find module"
-   node_modules отсутствует

**Решение:**

```bash
# Установить зависимости
cd /var/www/eisenhower-matrix
sudo npm install

cd backend
sudo npm install

cd ../frontend
sudo npm install
sudo npm run build
```

### 4. Бэкенд не отвечает

**Симптомы:**

-   Порт 5000 не отвечает
-   curl http://localhost:5000/health не работает

**Диагностика:**

```bash
# Проверить, что порт занят
sudo netstat -tlnp | grep :5000

# Проверить логи бэкенда
tail -f /var/log/eisenhower-matrix/backend.log

# Проверить PM2 процессы
pm2 list
pm2 logs eisenhower-backend
```

**Решения:**

```bash
# 1. Остановить конфликтующие процессы
sudo pkill -f "node.*server.js"

# 2. Перезапустить сервис
sudo systemctl restart eisenhower-matrix

# 3. Проверить конфигурацию бэкенда
cd /var/www/eisenhower-matrix/backend
node server.js
```

### 5. Фронтенд не собирается

**Симптомы:**

-   Ошибки при `npm run build`
-   Директория dist отсутствует

**Решение:**

```bash
cd /var/www/eisenhower-matrix/frontend

# Очистить кэш
sudo rm -rf node_modules package-lock.json
sudo npm install

# Собрать фронтенд
sudo npm run build

# Проверить результат
ls -la dist/
```

### 6. Apache не обслуживает файлы

**Симптомы:**

-   Сайт не открывается
-   404 ошибки для статических файлов

**Диагностика:**

```bash
# Проверить конфигурацию Apache
sudo apache2ctl configtest

# Проверить, что сайт включен
sudo a2ensite eisenhower-matrix

# Проверить логи Apache
sudo tail -f /var/log/apache2/error.log
```

**Решение:**

```bash
# 1. Включить необходимые модули
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite

# 2. Перезагрузить Apache
sudo systemctl reload apache2

# 3. Проверить права на файлы
sudo chown -R www-data:www-data /var/www/eisenhower-matrix/frontend/dist
```

### 7. Проблемы с правами доступа

**Симптомы:**

-   Permission denied ошибки
-   Файлы не читаются/не записываются

**Решение:**

```bash
# Установить правильного владельца
sudo chown -R www-data:www-data /var/www/eisenhower-matrix

# Установить права на директории
sudo find /var/www/eisenhower-matrix -type d -exec chmod 755 {} \;

# Установить права на файлы
sudo find /var/www/eisenhower-matrix -type f -exec chmod 644 {} \;

# Сделать скрипты исполняемыми
sudo chmod +x /var/www/eisenhower-matrix/*.sh
```

### 8. База данных не работает

**Симптомы:**

-   Ошибки SQLite
-   База данных не создается

**Решение:**

```bash
# Проверить права на базу данных
ls -la /var/www/eisenhower-matrix/backend/database.sqlite

# Создать базу данных заново
cd /var/www/eisenhower-matrix/backend
sudo rm -f database.sqlite
sudo node server.js
```

## Команды для экстренного восстановления

### Полная переустановка

```bash
# 1. Остановить все процессы
sudo systemctl stop eisenhower-matrix
sudo pkill -f "node.*server.js"

# 2. Удалить сервис
sudo ./install-service.sh uninstall

# 3. Очистить зависимости
cd /var/www/eisenhower-matrix
sudo rm -rf node_modules
cd backend && sudo rm -rf node_modules
cd ../frontend && sudo rm -rf node_modules dist

# 4. Переустановить все
sudo ./install-service.sh
```

### Ручной запуск для тестирования

```bash
# Запустить бэкенд вручную
cd /var/www/eisenhower-matrix/backend
sudo -u www-data node server.js

# В другом терминале проверить
curl http://localhost:5000/health
```

### Проверка конфигурации

```bash
# Проверить все конфигурационные файлы
sudo ./debug-app.sh

# Проверить systemd сервис
sudo systemctl cat eisenhower-matrix

# Проверить Apache конфигурацию
sudo apache2ctl -S
```

## Логи и мониторинг

### Просмотр логов

```bash
# Логи systemd сервиса
sudo journalctl -u eisenhower-matrix -f

# Логи бэкенда
tail -f /var/log/eisenhower-matrix/backend.log

# Логи Apache
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/access.log
```

### Мониторинг процессов

```bash
# Проверить процессы Node.js
ps aux | grep node

# Проверить использование портов
sudo netstat -tlnp | grep :5000

# Проверить использование ресурсов
htop
```

## Получение помощи

Если проблемы не решаются:

1. Запустите полную диагностику: `sudo ./debug-app.sh`
2. Сохраните вывод в файл: `sudo ./debug-app.sh > debug-output.txt 2>&1`
3. Проверьте логи: `sudo journalctl -u eisenhower-matrix -n 100`
4. Попробуйте ручной запуск: `cd /var/www/eisenhower-matrix/backend && sudo -u www-data node server.js`

## Полезные команды

```bash
# Быстрая проверка статуса
sudo systemctl status eisenhower-matrix

# Перезапуск сервиса
sudo systemctl restart eisenhower-matrix

# Проверка конфигурации
sudo apache2ctl configtest

# Проверка портов
sudo ss -tlnp | grep :5000

# Проверка дискового пространства
df -h

# Проверка памяти
free -h
```
