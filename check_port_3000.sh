#!/bin/bash

echo "🔍 Проверяем порт 3000..."

# Проверка, что слушает на порту 3000
if sudo netstat -tlnp | grep :3000; then
    echo "⚠️ Порт 3000 занят. Проверяем, что запущено..."
    
    # Получение PID процесса на порту 3000
    PID=$(sudo netstat -tlnp | grep :3000 | awk '{print $7}' | cut -d'/' -f1)
    
    if [ ! -z "$PID" ]; then
        echo "📋 Процесс на порту 3000 (PID: $PID):"
        ps -p $PID -o pid,ppid,cmd
        
        echo ""
        echo "❓ Что делать с процессом на порту 3000?"
        echo "1. Остановить процесс (рекомендуется)"
        echo "2. Изменить порт приложения на другой"
        echo "3. Пропустить проверку"
        
        read -p "Выберите вариант (1-3): " choice
        
        case $choice in
            1)
                echo "🛑 Останавливаем процесс $PID..."
                sudo kill $PID
                sleep 2
                
                # Проверяем, остановился ли процесс
                if sudo netstat -tlnp | grep :3000; then
                    echo "⚠️ Процесс не остановился. Принудительная остановка..."
                    sudo kill -9 $PID
                fi
                
                echo "✅ Порт 3000 освобожден"
                ;;
            2)
                echo "📝 Для изменения порта отредактируйте ecosystem.config.js"
                echo "Измените PORT: 3000 на другой порт (например, 5000)"
                exit 1
                ;;
            3)
                echo "⏭️ Пропускаем проверку порта"
                ;;
            *)
                echo "❌ Неверный выбор"
                exit 1
                ;;
        esac
    fi
else
    echo "✅ Порт 3000 свободен"
fi

echo "🔍 Проверка завершена"

