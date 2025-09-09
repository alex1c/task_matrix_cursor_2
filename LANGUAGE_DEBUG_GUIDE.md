# Диагностика проблемы с переключением языков на Ubuntu сервере

## Проблема

При переключении языков всегда остается русский язык, ошибок в консоли нет.

## Возможные причины

### 1. Отсутствуют файлы переводов

Файлы переводов не скопированы в `frontend/public/messages/`

### 2. Backend не обслуживает статические файлы

Сервер не настроен для раздачи файлов переводов

### 3. Неправильные права доступа

Файлы недоступны для чтения

### 4. Кэширование браузера

Браузер кэширует старые файлы

## Диагностика

### Шаг 1: Проверить файлы переводов

```bash
cd /var/www/eisenhower-matrix

# Проверить структуру папок
ls -la frontend/public/messages/

# Проверить каждый файл
for lang in ru en de es zh; do
    echo "Проверка ${lang}.json:"
    if [ -f "frontend/public/messages/${lang}.json" ]; then
        echo "✅ Файл существует"
        ls -la "frontend/public/messages/${lang}.json"
    else
        echo "❌ Файл отсутствует"
    fi
done
```

### Шаг 2: Проверить доступность через HTTP

```bash
# Проверить, что файлы доступны через HTTP
curl -I http://localhost:5000/messages/en.json
curl -I http://localhost:5000/messages/de.json
curl -I http://localhost:5000/messages/es.json
curl -I http://localhost:5000/messages/zh.json
```

### Шаг 3: Проверить консоль браузера

1. Откройте DevTools (F12)
2. Перейдите на вкладку Network
3. Попробуйте переключить язык
4. Посмотрите, загружаются ли файлы переводов

## Исправление

### Вариант 1: Автоматическое исправление

```bash
cd /var/www/eisenhower-matrix

# Скачать и запустить скрипт исправления
wget https://raw.githubusercontent.com/your-repo/fix-language-files.sh
chmod +x fix-language-files.sh
./fix-language-files.sh
```

### Вариант 2: Ручное исправление

#### 1. Создать папку для файлов переводов

```bash
cd /var/www/eisenhower-matrix
mkdir -p frontend/public/messages
```

#### 2. Скопировать файлы переводов

```bash
# Если есть папка messages в frontend
if [ -d "frontend/messages" ]; then
    cp frontend/messages/*.json frontend/public/messages/
fi
```

#### 3. Создать базовые файлы переводов (если их нет)

```bash
# Создать базовый файл для английского
cat > frontend/public/messages/en.json << 'EOF'
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

# Создать базовый файл для немецкого
cat > frontend/public/messages/de.json << 'EOF'
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

# Создать базовый файл для испанского
cat > frontend/public/messages/es.json << 'EOF'
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

# Создать базовый файл для китайского
cat > frontend/public/messages/zh.json << 'EOF'
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
```

#### 4. Установить права доступа

```bash
chmod 644 frontend/public/messages/*.json
chown -R www-data:www-data frontend/public/messages/ 2>/dev/null || true
```

#### 5. Обновить backend для обслуживания статических файлов

```bash
# Добавить в backend/server.js после app.use(express.json());
echo "app.use(express.static('frontend/public'));" >> backend/server.js
```

#### 6. Перезапустить сервер

```bash
# Остановить сервер
pkill -f "node.*server.js"

# Запустить сервер
cd backend && npm start &
cd ..
```

## Проверка результата

### 1. Проверить файлы

```bash
ls -la frontend/public/messages/
```

### 2. Проверить HTTP доступность

```bash
curl http://localhost:5000/messages/en.json
```

### 3. Проверить в браузере

1. Откройте приложение
2. Откройте DevTools (F12)
3. Перейдите на вкладку Network
4. Попробуйте переключить язык
5. Проверьте, загружаются ли файлы переводов

## Дополнительные проверки

### Проверить логи сервера

```bash
# Если сервер запущен в фоне
tail -f /var/log/your-app.log

# Или запустить сервер в foreground для просмотра логов
cd backend && npm start
```

### Проверить права доступа

```bash
# Проверить права на папку
ls -la frontend/public/

# Проверить права на файлы
ls -la frontend/public/messages/
```

### Очистить кэш браузера

1. Откройте DevTools (F12)
2. Правой кнопкой на кнопке обновления
3. Выберите "Очистить кэш и жесткое обновление"

## Ожидаемый результат

После исправления:

-   ✅ Файлы переводов доступны в `frontend/public/messages/`
-   ✅ Backend обслуживает статические файлы
-   ✅ Переключение языков работает корректно
-   ✅ В Network tab видны запросы к файлам переводов
