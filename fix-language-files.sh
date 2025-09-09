#!/bin/bash

# Скрипт для исправления проблемы с переводами на Ubuntu сервере

echo "🔧 Исправление проблемы с переводами..."

# Переходим в папку проекта
cd /var/www/eisenhower-matrix

# 1. Создаем папку public/messages если её нет
echo "📁 Создание папки frontend/public/messages..."
mkdir -p frontend/public/messages

# 2. Копируем файлы переводов из messages в public/messages
echo "📄 Копирование файлов переводов..."
if [ -d "frontend/messages" ]; then
    cp frontend/messages/*.json frontend/public/messages/ 2>/dev/null
    echo "✅ Файлы скопированы из frontend/messages/"
else
    echo "❌ Папка frontend/messages не найдена"
fi

# 3. Проверяем, что файлы существуют
echo "🔍 Проверка файлов переводов..."
for lang in ru en de es zh; do
    if [ -f "frontend/public/messages/${lang}.json" ]; then
        echo "✅ ${lang}.json существует"
    else
        echo "❌ ${lang}.json отсутствует - создаем базовый файл"
        
        # Создаем базовый файл перевода
        case $lang in
            "ru")
                cat > "frontend/public/messages/${lang}.json" << 'EOF'
{
  "common": {
    "add": "Добавить",
    "edit": "Редактировать",
    "delete": "Удалить",
    "save": "Сохранить",
    "cancel": "Отмена",
    "allPriorities": "Все приоритеты"
  },
  "header": {
    "title": "Матрица Эйзенхауэра",
    "subtitle": "Управление задачами по приоритетам"
  }
}
EOF
                ;;
            "en")
                cat > "frontend/public/messages/${lang}.json" << 'EOF'
{
  "common": {
    "add": "Add",
    "edit": "Edit",
    "delete": "Delete",
    "save": "Save",
    "cancel": "Cancel",
    "allPriorities": "All priorities"
  },
  "header": {
    "title": "Eisenhower Matrix",
    "subtitle": "Task management by priorities"
  }
}
EOF
                ;;
            "de")
                cat > "frontend/public/messages/${lang}.json" << 'EOF'
{
  "common": {
    "add": "Hinzufügen",
    "edit": "Bearbeiten",
    "delete": "Löschen",
    "save": "Speichern",
    "cancel": "Abbrechen",
    "allPriorities": "Alle Prioritäten"
  },
  "header": {
    "title": "Eisenhower-Matrix",
    "subtitle": "Aufgabenmanagement nach Prioritäten"
  }
}
EOF
                ;;
            "es")
                cat > "frontend/public/messages/${lang}.json" << 'EOF'
{
  "common": {
    "add": "Agregar",
    "edit": "Editar",
    "delete": "Eliminar",
    "save": "Guardar",
    "cancel": "Cancelar",
    "allPriorities": "Todas las prioridades"
  },
  "header": {
    "title": "Matriz de Eisenhower",
    "subtitle": "Gestión de tareas por prioridades"
  }
}
EOF
                ;;
            "zh")
                cat > "frontend/public/messages/${lang}.json" << 'EOF'
{
  "common": {
    "add": "添加",
    "edit": "编辑",
    "delete": "删除",
    "save": "保存",
    "cancel": "取消",
    "allPriorities": "所有优先级"
  },
  "header": {
    "title": "艾森豪威尔矩阵",
    "subtitle": "按优先级管理任务"
  }
}
EOF
                ;;
        esac
    fi
done

# 4. Устанавливаем правильные права доступа
echo "🔐 Установка прав доступа..."
chmod 644 frontend/public/messages/*.json
chown -R www-data:www-data frontend/public/messages/ 2>/dev/null || true

# 5. Проверяем, что backend сервер обслуживает статические файлы
echo "🌐 Проверка конфигурации backend сервера..."
if [ -f "backend/server.js" ]; then
    if grep -q "express.static" backend/server.js; then
        echo "✅ Backend настроен для обслуживания статических файлов"
    else
        echo "❌ Backend не настроен для обслуживания статических файлов"
        echo "Добавьте в backend/server.js:"
        echo "app.use(express.static('frontend/public'));"
    fi
else
    echo "❌ Файл backend/server.js не найден"
fi

# 6. Проверяем, запущен ли сервер
echo "🚀 Проверка статуса сервера..."
if pgrep -f "node.*server.js" > /dev/null; then
    echo "✅ Backend сервер запущен"
    echo "🔄 Перезапуск сервера для применения изменений..."
    pkill -f "node.*server.js"
    sleep 2
    cd backend && npm start &
    cd ..
    sleep 3
    echo "✅ Сервер перезапущен"
else
    echo "❌ Backend сервер не запущен"
    echo "🚀 Запуск сервера..."
    cd backend && npm start &
    cd ..
    sleep 3
    echo "✅ Сервер запущен"
fi

echo ""
echo "✅ Исправление завершено!"
echo ""
echo "🧪 Тестирование:"
echo "1. Откройте приложение в браузере"
echo "2. Попробуйте переключить язык"
echo "3. Проверьте консоль браузера на ошибки"
echo ""
echo "📋 Если проблема остается:"
echo "1. Проверьте права доступа к файлам"
echo "2. Убедитесь, что backend сервер запущен"
echo "3. Проверьте, что файлы переводов доступны по HTTP"
