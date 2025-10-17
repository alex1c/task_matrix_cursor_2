# Исправление проблемы с сервисом Eisenhower Matrix

## Проблема

Сервис не запускается с ошибкой "control process exited with error code".

## Быстрое решение

### 1. Запустите скрипт быстрого исправления:

```bash
cd /var/www/eisenhower-matrix
sudo chmod +x quick-fix.sh
sudo ./quick-fix.sh
```

### 2. Если скрипт не существует, выполните команды вручную:

```bash
# 1. Остановить сервис
sudo systemctl stop eisenhower-matrix

# 2. Исправить права доступа
sudo chown -R www-data:www-data /var/www/eisenhower-matrix
sudo chmod +x /var/www/eisenhower-matrix/start-app.sh

# 3. Создать директорию логов
sudo mkdir -p /var/log/eisenhower-matrix
sudo chown www-data:www-data /var/log/eisenhower-matrix

# 4. Установить зависимости
cd /var/www/eisenhower-matrix
sudo -u www-data npm install --production

cd /var/www/eisenhower-matrix/backend
sudo -u www-data npm install --production

cd /var/www/eisenhower-matrix/frontend
sudo -u www-data npm install
sudo -u www-data npm run build

# 5. Перезагрузить systemd
sudo systemctl daemon-reload

# 6. Запустить сервис
sudo systemctl start eisenhower-matrix

# 7. Проверить статус
sudo systemctl status eisenhower-matrix
```

## Диагностика проблемы

### Проверьте логи сервиса:

```bash
sudo journalctl -u eisenhower-matrix -n 50
```

### Проверьте статус сервиса:

```bash
sudo systemctl status eisenhower-matrix
```

### Проверьте права доступа:

```bash
ls -la /var/www/eisenhower-matrix/
ls -la /var/www/eisenhower-matrix/start-app.sh
```

### Проверьте, что файлы существуют:

```bash
ls -la /var/www/eisenhower-matrix/backend/server.js
ls -la /var/www/eisenhower-matrix/frontend/package.json
```

## Возможные причины проблемы

### 1. Неправильные права доступа

-   Файлы принадлежат root вместо www-data
-   Скрипт start-app.sh не исполняемый

### 2. Отсутствующие зависимости

-   node_modules не установлены
-   npm install не выполнен

### 3. Неправильная структура проекта

-   Отсутствует server.js
-   Отсутствует package.json

### 4. Проблемы с systemd

-   Неправильная конфигурация сервиса
-   Проблемы с путями в сервисе

## Пошаговое исправление

### Шаг 1: Проверьте структуру проекта

```bash
cd /var/www/eisenhower-matrix
ls -la
ls -la backend/
ls -la frontend/
```

### Шаг 2: Исправьте права доступа

```bash
sudo chown -R www-data:www-data /var/www/eisenhower-matrix
sudo chmod +x /var/www/eisenhower-matrix/start-app.sh
```

### Шаг 3: Установите зависимости

```bash
cd /var/www/eisenhower-matrix
sudo -u www-data npm install

cd backend
sudo -u www-data npm install

cd ../frontend
sudo -u www-data npm install
sudo -u www-data npm run build
```

### Шаг 4: Создайте директорию логов

```bash
sudo mkdir -p /var/log/eisenhower-matrix
sudo chown www-data:www-data /var/log/eisenhower-matrix
```

### Шаг 5: Перезапустите сервис

```bash
sudo systemctl daemon-reload
sudo systemctl restart eisenhower-matrix
```

### Шаг 6: Проверьте результат

```bash
sudo systemctl status eisenhower-matrix
sudo journalctl -u eisenhower-matrix -f
```

## Тестирование вручную

### Запустите бэкенд вручную для тестирования:

```bash
cd /var/www/eisenhower-matrix/backend
sudo -u www-data node server.js
```

### В другом терминале проверьте:

```bash
curl http://localhost:5000/health
```

## Если ничего не помогает

### Полная переустановка:

```bash
# 1. Остановить и удалить сервис
sudo systemctl stop eisenhower-matrix
sudo systemctl disable eisenhower-matrix
sudo rm /etc/systemd/system/eisenhower-matrix.service
sudo systemctl daemon-reload

# 2. Очистить зависимости
cd /var/www/eisenhower-matrix
sudo rm -rf node_modules
cd backend && sudo rm -rf node_modules
cd ../frontend && sudo rm -rf node_modules dist

# 3. Переустановить
sudo ./install-service.sh
```

## Полезные команды для диагностики

```bash
# Проверить процессы Node.js
ps aux | grep node

# Проверить порты
sudo netstat -tlnp | grep :5000

# Проверить использование диска
df -h

# Проверить память
free -h

# Проверить логи системы
sudo journalctl -xe
```

## Контакты для поддержки

Если проблема не решается:

1. Сохраните вывод `sudo journalctl -u eisenhower-matrix -n 100`
2. Сохраните вывод `sudo systemctl status eisenhower-matrix`
3. Проверьте права доступа: `ls -la /var/www/eisenhower-matrix/`
