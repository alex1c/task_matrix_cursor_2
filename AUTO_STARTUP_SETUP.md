# Автоматический запуск Eisenhower Matrix на Ubuntu с Apache

Этот набор скриптов обеспечивает автоматический запуск приложения Eisenhower Matrix после перезагрузки сервера Ubuntu с веб-сервером Apache.

## Файлы в комплекте

-   `start-app.sh` - Основной скрипт запуска приложения
-   `eisenhower-matrix.service` - Systemd сервис для автозапуска
-   `install-service.sh` - Скрипт установки и настройки
-   `AUTO_STARTUP_SETUP.md` - Данная инструкция

## Быстрая установка

### 1. Подготовка

Убедитесь, что ваш проект находится в директории `/var/www/eisenhower-matrix`. Если нет, измените путь в скриптах.

```bash
# Перейдите в директорию проекта
cd /var/www/eisenhower-matrix

# Сделайте скрипты исполняемыми
chmod +x start-app.sh
chmod +x install-service.sh
```

### 2. Установка сервиса

```bash
# Запустите установку (требуются права root)
sudo ./install-service.sh
```

Скрипт автоматически:

-   Установит Node.js и PM2 (если не установлены)
-   Настроит права доступа
-   Создаст systemd сервис
-   Настроит Apache (базовая конфигурация)
-   Запустит сервис

### 3. Проверка работы

```bash
# Проверить статус сервиса
sudo systemctl status eisenhower-matrix

# Посмотреть логи
sudo journalctl -u eisenhower-matrix -f

# Проверить работу приложения
curl http://localhost:5000/health
```

## Управление сервисом

### Основные команды

```bash
# Запустить сервис
sudo systemctl start eisenhower-matrix

# Остановить сервис
sudo systemctl stop eisenhower-matrix

# Перезапустить сервис
sudo systemctl restart eisenhower-matrix

# Проверить статус
sudo systemctl status eisenhower-matrix

# Посмотреть логи
sudo journalctl -u eisenhower-matrix -f

# Отключить автозапуск
sudo systemctl disable eisenhower-matrix

# Включить автозапуск
sudo systemctl enable eisenhower-matrix
```

### Команды скрипта start-app.sh

```bash
# Запустить приложение
./start-app.sh

# Остановить приложение
./start-app.sh stop

# Перезапустить приложение
./start-app.sh restart

# Проверить статус
./start-app.sh status

# Посмотреть логи
./start-app.sh logs

# Установить PM2
./start-app.sh install
```

## Конфигурация Apache

Скрипт установки создает базовую конфигурацию Apache в файле `/etc/apache2/sites-available/eisenhower-matrix.conf`:

```apache
<VirtualHost *:80>
    ServerName todolist.su
    ServerAlias www.todolist.su
    DocumentRoot /var/www/eisenhower-matrix/frontend/dist

    # Proxy API requests to backend
    ProxyPreserveHost On
    ProxyPass /api/ http://localhost:5000/
    ProxyPassReverse /api/ http://localhost:5000/

    # Serve static files
    <Directory "/var/www/eisenhower-matrix/frontend/dist">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Logging
    ErrorLog ${APACHE_LOG_DIR}/eisenhower-matrix_error.log
    CustomLog ${APACHE_LOG_DIR}/eisenhower-matrix_access.log combined
</VirtualHost>
```

### Настройка SSL (рекомендуется)

Для настройки SSL используйте Let's Encrypt:

```bash
# Установите certbot
sudo apt install certbot python3-certbot-apache

# Получите SSL сертификат
sudo certbot --apache -d todolist.su -d www.todolist.su
```

## Структура логов

Логи приложения сохраняются в `/var/log/eisenhower-matrix/`:

-   `backend.log` - Логи бэкенда
-   `backend.pid` - PID файл процесса бэкенда

Логи systemd сервиса доступны через journalctl:

```bash
# Все логи сервиса
sudo journalctl -u eisenhower-matrix

# Логи за последний час
sudo journalctl -u eisenhower-matrix --since "1 hour ago"

# Следить за логами в реальном времени
sudo journalctl -u eisenhower-matrix -f
```

## Устранение неполадок

### Сервис не запускается

1. Проверьте логи:

```bash
sudo journalctl -u eisenhower-matrix -n 50
```

2. Проверьте права доступа:

```bash
ls -la /var/www/eisenhower-matrix/
ls -la /var/log/eisenhower-matrix/
```

3. Проверьте, что Node.js установлен:

```bash
node --version
npm --version
```

### Бэкенд не отвечает

1. Проверьте, что порт 5000 свободен:

```bash
sudo netstat -tlnp | grep :5000
```

2. Проверьте логи бэкенда:

```bash
tail -f /var/log/eisenhower-matrix/backend.log
```

3. Перезапустите сервис:

```bash
sudo systemctl restart eisenhower-matrix
```

### Apache не обслуживает статические файлы

1. Проверьте конфигурацию Apache:

```bash
sudo apache2ctl configtest
```

2. Убедитесь, что сайт включен:

```bash
sudo a2ensite eisenhower-matrix
sudo systemctl reload apache2
```

3. Проверьте, что фронтенд собран:

```bash
ls -la /var/www/eisenhower-matrix/frontend/dist/
```

## Удаление сервиса

Для полного удаления сервиса:

```bash
# Остановить и удалить сервис
sudo ./install-service.sh uninstall

# Удалить логи (опционально)
sudo rm -rf /var/log/eisenhower-matrix

# Удалить конфигурацию Apache (опционально)
sudo a2dissite eisenhower-matrix
sudo rm /etc/apache2/sites-available/eisenhower-matrix.conf
sudo systemctl reload apache2
```

## Мониторинг

Для мониторинга состояния приложения можно использовать:

```bash
# Создать скрипт мониторинга
cat > /usr/local/bin/check-eisenhower.sh << 'EOF'
#!/bin/bash
if ! systemctl is-active --quiet eisenhower-matrix; then
    echo "Eisenhower Matrix service is down! Restarting..."
    systemctl restart eisenhower-matrix
fi
EOF

chmod +x /usr/local/bin/check-eisenhower.sh

# Добавить в crontab для проверки каждые 5 минут
echo "*/5 * * * * /usr/local/bin/check-eisenhower.sh" | sudo crontab -
```

## Безопасность

Рекомендации по безопасности:

1. Настройте файрвол:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. Регулярно обновляйте систему:

```bash
sudo apt update && sudo apt upgrade
```

3. Настройте автоматические бэкапы базы данных
4. Используйте SSL сертификаты
5. Ограничьте доступ к административным интерфейсам

## Поддержка

При возникновении проблем:

1. Проверьте логи сервиса и приложения
2. Убедитесь, что все зависимости установлены
3. Проверьте права доступа к файлам
4. Убедитесь, что порты не заняты другими процессами
