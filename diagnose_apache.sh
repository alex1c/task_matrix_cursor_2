#!/bin/bash

echo "🔍 Диагностика проблемы с Apache..."

echo ""
echo "=== 1. Проверка файла index.css ==="
if [ -f "/var/www/eisenhower-matrix/frontend/src/index.css" ]; then
    echo "✅ index.css найден"
    echo "Размер файла: $(ls -lh /var/www/eisenhower-matrix/frontend/src/index.css | awk '{print $5}')"
    echo "Первые 3 строки:"
    head -3 /var/www/eisenhower-matrix/frontend/src/index.css
else
    echo "❌ index.css НЕ найден!"
fi

echo ""
echo "=== 2. Проверка папки dist ==="
if [ -d "/var/www/eisenhower-matrix/frontend/dist" ]; then
    echo "✅ Папка dist найдена"
    echo "Содержимое dist:"
    ls -la /var/www/eisenhower-matrix/frontend/dist/
    
    if [ -f "/var/www/eisenhower-matrix/frontend/dist/index.html" ]; then
        echo "✅ index.html найден в dist"
        echo "Размер: $(ls -lh /var/www/eisenhower-matrix/frontend/dist/index.html | awk '{print $5}')"
    else
        echo "❌ index.html НЕ найден в dist!"
    fi
    
    if [ -d "/var/www/eisenhower-matrix/frontend/dist/assets" ]; then
        echo "✅ Папка assets найдена"
        echo "Файлы в assets:"
        ls -la /var/www/eisenhower-matrix/frontend/dist/assets/
    else
        echo "❌ Папка assets НЕ найдена!"
    fi
else
    echo "❌ Папка dist НЕ найдена!"
fi

echo ""
echo "=== 3. Проверка прав доступа ==="
echo "Права на папку dist:"
ls -ld /var/www/eisenhower-matrix/frontend/dist/
echo "Права на файлы в dist:"
ls -la /var/www/eisenhower-matrix/frontend/dist/

echo ""
echo "=== 4. Проверка конфигурации Apache ==="
echo "Активные виртуальные хосты:"
sudo apache2ctl -S

echo ""
echo "Конфигурация eisenhower-matrix:"
if [ -f "/etc/apache2/sites-available/eisenhower-matrix.conf" ]; then
    echo "✅ Конфигурация найдена"
    echo "DocumentRoot:"
    grep -i "DocumentRoot" /etc/apache2/sites-available/eisenhower-matrix.conf
    echo "ServerName:"
    grep -i "ServerName" /etc/apache2/sites-available/eisenhower-matrix.conf
else
    echo "❌ Конфигурация НЕ найдена!"
fi

echo ""
echo "=== 5. Проверка логов Apache ==="
echo "Последние ошибки:"
sudo tail -10 /var/log/apache2/error.log

echo ""
echo "=== 6. Проверка портов ==="
echo "Порт 80:"
sudo netstat -tlnp | grep :80

echo ""
echo "=== 7. Статус Apache ==="
sudo systemctl status apache2 --no-pager -l

echo ""
echo "=== 8. Тест конфигурации ==="
sudo apache2ctl configtest

echo ""
echo "=== 9. Проверка модулей ==="
echo "Включенные модули:"
sudo apache2ctl -M | grep -E "(proxy|rewrite|expires|deflate)"

echo ""
echo "=== 10. Тест доступа к файлам ==="
if [ -f "/var/www/eisenhower-matrix/frontend/dist/index.html" ]; then
    echo "✅ index.html доступен для чтения"
    echo "Первые строки index.html:"
    head -5 /var/www/eisenhower-matrix/frontend/dist/index.html
else
    echo "❌ index.html недоступен!"
fi

echo ""
echo "=== 11. Проверка DNS ==="
echo "IP адрес todolist.su:"
nslookup todolist.su 2>/dev/null || echo "nslookup недоступен"

echo ""
echo "=== 12. Тест локального доступа ==="
echo "Тест curl localhost:"
curl -I http://localhost/ 2>/dev/null || echo "curl недоступен"

echo ""
echo "🔍 Диагностика завершена!"
