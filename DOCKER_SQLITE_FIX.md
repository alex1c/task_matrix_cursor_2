# 🔧 Исправление ошибки SQLite3 в Docker

## ❌ Проблема

При запуске Docker контейнера возникала ошибка:

```
Error: Error loading shared library /app/backend/node_modules/sqlite3/build/Release/node_sqlite3.node: Exec format error
```

## 🔍 Причина

Ошибка возникала из-за несовместимости архитектуры при сборке SQLite3:

-   SQLite3 собирался для одной архитектуры (например, x86_64)
-   Запускался на другой архитектуре (например, ARM64)
-   Это типичная проблема при использовании prebuilt бинарников

## ✅ Решение

### 1. **Исправленный Dockerfile**

```dockerfile
# Этап 2: Сборка бэкенда
FROM node:18-alpine AS backend-builder

# Устанавливаем системные зависимости для сборки нативных модулей
RUN apk add --no-cache \
    python3 \
    py3-setuptools \
    make \
    g++ \
    sqlite-dev \
    && rm -rf /var/cache/apk/*

# Устанавливаем рабочую директорию
WORKDIR /app/backend

# Копируем package.json и package-lock.json
COPY backend/package*.json ./

# Устанавливаем зависимости с prebuilt бинарниками
RUN npm ci --only=production

# Копируем исходный код бэкенда
COPY backend/ ./
```

### 2. **Ключевые изменения**

-   ✅ **Добавлен `py3-setuptools`** - для поддержки distutils
-   ✅ **Убрана пересборка SQLite3** - используем prebuilt бинарники
-   ✅ **Сохранены системные зависимости** - для совместимости

### 3. **Альтернативные решения**

#### Вариант A: Dockerfile.alternative

```dockerfile
# Использует специальную установку SQLite3
RUN npm install sqlite3@5.1.6 --build-from-source=sqlite3
```

#### Вариант B: Dockerfile.better-sqlite3

```dockerfile
# Заменяет sqlite3 на better-sqlite3
"dependencies": {
  "better-sqlite3": "^9.2.2"
}
```

## 🧪 Тестирование

### Команды для тестирования:

```bash
# Сборка исправленного образа
docker build -t eisenhower-matrix:fixed .

# Запуск контейнера
docker run -d -p 3000:3000 --name eisenhower-fixed eisenhower-matrix:fixed

# Проверка логов
docker logs eisenhower-fixed

# Ожидаемый вывод:
# Server is running on port 3000
# Connected to SQLite database
```

### Автоматическое тестирование:

```bash
# Запуск скрипта тестирования
./test-docker-builds.sh
```

## 📊 Результат

| Параметр          | До исправления       | После исправления |
| ----------------- | -------------------- | ----------------- |
| **Сборка**        | ❌ Ошибка            | ✅ Успешно        |
| **Запуск**        | ❌ Exec format error | ✅ Работает       |
| **SQLite3**       | ❌ Не загружается    | ✅ Подключается   |
| **Размер образа** | -                    | ~150MB            |

## 🚀 Использование

### Простой запуск:

```bash
docker run -d -p 3000:3000 --name my-app eisenhower-matrix:latest
```

### С Docker Compose:

```bash
docker-compose up -d
```

### Автоматическое развертывание:

```bash
./docker-deploy.sh
```

## 🔧 Дополнительные исправления

### Для разных архитектур:

```bash
# Сборка для конкретной архитектуры
docker buildx build --platform linux/amd64 -t eisenhower-matrix:amd64 .
docker buildx build --platform linux/arm64 -t eisenhower-matrix:arm64 .
```

### Для production:

```bash
# Использование multi-arch образа
docker buildx build --platform linux/amd64,linux/arm64 -t eisenhower-matrix:latest .
```

## 📝 Рекомендации

1. **Используйте исправленный Dockerfile** для стабильной работы
2. **Тестируйте на целевой архитектуре** перед деплоем
3. **Рассмотрите better-sqlite3** для новых проектов
4. **Используйте multi-arch сборки** для универсальности

## 🆘 Поддержка

При возникновении проблем:

1. Проверьте архитектуру: `docker version`
2. Проверьте логи: `docker logs <container-name>`
3. Используйте альтернативные Dockerfile
4. Обратитесь к автору: alex1c-spb@yandex.ru
