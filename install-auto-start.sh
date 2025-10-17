#!/bin/bash

# Скрипт для установки автоматического запуска приложения
# Автор: AI Assistant

echo "🔧 Установка автоматического запуска приложения..."

# 1. Сделать скрипт исполняемым
chmod +x auto-start.sh

# 2. Создать systemd сервис
sudo tee /etc/systemd/system/todolist-auto-start.service > /dev/null << 'EOF'
[Unit]
Description=Auto Start Todolist Application
After=network.target
Wants=network.target

[Service]
Type=oneshot
User=root
WorkingDirectory=/var/www/eisenhower-matrix
ExecStart=/var/www/eisenhower-matrix/auto-start.sh
RemainAfterExit=yes
StandardOutput=journal
StandardError=journal
SyslogIdentifier=todolist-auto-start

[Install]
WantedBy=multi-user.target
EOF

# 3. Включить сервис
sudo systemctl daemon-reload
sudo systemctl enable todolist-auto-start.service

# 4. Создать каталог для логов (если не существует)
sudo mkdir -p /var/log/eisenhower-matrix
sudo chown www-data:www-data /var/log/eisenhower-matrix

echo ""
echo "✅ Автоматический запуск настроен!"
echo ""
echo "📋 Команды для управления:"
echo "   Запустить сейчас: sudo systemctl start todolist-auto-start"
echo "   Проверить статус: sudo systemctl status todolist-auto-start"
echo "   Посмотреть логи: sudo journalctl -u todolist-auto-start -f"
echo "   Отключить: sudo systemctl disable todolist-auto-start"
echo ""
echo "🚀 Приложение будет автоматически запускаться после перезагрузки сервера!"
echo ""
