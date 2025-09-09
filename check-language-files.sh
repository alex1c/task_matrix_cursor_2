#!/bin/bash

# Скрипт для проверки файлов переводов на Ubuntu сервере

echo "🔍 Проверка файлов переводов на сервере..."
echo ""

# Переходим в папку проекта
cd /var/www/eisenhower-matrix

echo "📁 Текущая папка: $(pwd)"
echo ""

# Проверяем структуру папок
echo "📂 Структура папок:"
ls -la
echo ""

# Проверяем папку frontend
echo "📂 Содержимое папки frontend:"
ls -la frontend/
echo ""

# Проверяем папку public
echo "📂 Содержимое папки frontend/public:"
ls -la frontend/public/
echo ""

# Проверяем папку messages
echo "📂 Содержимое папки frontend/public/messages:"
if [ -d "frontend/public/messages" ]; then
    ls -la frontend/public/messages/
    echo ""
    
    # Проверяем каждый файл перевода
    echo "📄 Проверка файлов переводов:"
    for lang in ru en de es zh; do
        if [ -f "frontend/public/messages/${lang}.json" ]; then
            echo "✅ ${lang}.json существует"
            # Проверяем размер файла
            size=$(stat -c%s "frontend/public/messages/${lang}.json")
            echo "   Размер: ${size} байт"
            
            # Проверяем, что файл содержит JSON
            if python3 -m json.tool "frontend/public/messages/${lang}.json" > /dev/null 2>&1; then
                echo "   ✅ JSON валидный"
            else
                echo "   ❌ JSON невалидный"
            fi
        else
            echo "❌ ${lang}.json отсутствует"
        fi
        echo ""
    done
else
    echo "❌ Папка frontend/public/messages не существует"
    echo ""
    
    # Проверяем, есть ли папка messages в другом месте
    echo "🔍 Поиск папки messages:"
    find . -name "messages" -type d 2>/dev/null
    echo ""
fi

# Проверяем папку messages в корне frontend
echo "📂 Содержимое папки frontend/messages:"
if [ -d "frontend/messages" ]; then
    ls -la frontend/messages/
    echo ""
else
    echo "❌ Папка frontend/messages не существует"
    echo ""
fi

# Проверяем, запущен ли сервер
echo "🌐 Проверка запущенного сервера:"
if pgrep -f "node.*server.js" > /dev/null; then
    echo "✅ Backend сервер запущен"
    # Получаем PID процесса
    pid=$(pgrep -f "node.*server.js")
    echo "   PID: $pid"
else
    echo "❌ Backend сервер не запущен"
fi

# Проверяем, доступны ли файлы через HTTP
echo ""
echo "🌐 Проверка доступности файлов через HTTP:"
if command -v curl > /dev/null; then
    for lang in ru en de es zh; do
        echo "Проверка http://localhost:5000/messages/${lang}.json:"
        if curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/messages/${lang}.json" | grep -q "200"; then
            echo "✅ ${lang}.json доступен через HTTP"
        else
            echo "❌ ${lang}.json недоступен через HTTP"
        fi
    done
else
    echo "❌ curl не установлен, проверка HTTP недоступна"
fi

echo ""
echo "🔧 Рекомендации:"
echo "1. Убедитесь, что файлы переводов находятся в frontend/public/messages/"
echo "2. Проверьте, что backend сервер запущен и обслуживает статические файлы"
echo "3. Проверьте права доступа к файлам"
echo "4. Убедитесь, что файлы переводов скопированы из frontend/messages/ в frontend/public/messages/"
