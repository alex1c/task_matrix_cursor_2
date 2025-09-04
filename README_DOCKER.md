# 🐳 Docker развертывание Матрицы Эйзенхауэра

Этот документ описывает, как развернуть приложение Матрица Эйзенхауэра с помощью Docker.

## 📋 Требования

-   Docker 20.10+
-   Docker Compose 2.0+
-   512 MB RAM (минимум)
-   1 GB свободного места на диске

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd task_matrix_cursor_2
```

### 2. Автоматическое развертывание

```bash
./docker-deploy.sh
```

### 3. Ручное развертывание

```bash
# Сборка образа
docker-compose build

# Запуск контейнера
docker-compose up -d

# Проверка статуса
docker-compose ps
```

## 🔧 Конфигурация

### Переменные окружения

```yaml
environment:
    - NODE_ENV=production
    - PORT=3000
    - DB_PATH=/app/data/database.sqlite
```

### Порты

-   **3000** - HTTP порт приложения

### Volumes

-   **eisenhower_data** - постоянное хранение базы данных
-   **./logs** - логи приложения

## 📊 Мониторинг

### Просмотр логов

```bash
# Все логи
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f eisenhower-matrix
```

### Проверка здоровья

```bash
# Статус контейнера
docker-compose ps

# Health check
curl http://localhost:3000/api/health
```

### Статистика ресурсов

```bash
# Использование ресурсов
docker stats eisenhower-matrix-app
```

## 🔄 Обновление

### Обновление приложения

```bash
# Остановка
docker-compose down

# Обновление кода
git pull

# Пересборка и запуск
./docker-deploy.sh
```

### Обновление только образа

```bash
docker-compose pull
docker-compose up -d
```

## 🛠️ Управление

### Основные команды

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Перезапуск
docker-compose restart

# Просмотр логов
docker-compose logs -f

# Вход в контейнер
docker-compose exec eisenhower-matrix sh
```

### Резервное копирование

```bash
# Создание бэкапа базы данных
docker-compose exec eisenhower-matrix cp /app/data/database.sqlite /app/data/backup-$(date +%Y%m%d).sqlite

# Копирование бэкапа на хост
docker cp eisenhower-matrix-app:/app/data/backup-20240115.sqlite ./backup.sqlite
```

## 🔒 Безопасность

### Пользователь

-   Приложение запускается от пользователя `nodejs` (UID: 1001)
-   Нет root привилегий

### Сеть

-   Контейнер изолирован в собственной сети
-   Доступ только к порту 3000

### Данные

-   База данных хранится в Docker volume
-   Автоматическое резервное копирование

## 🌐 Production развертывание

### С Traefik (рекомендуется)

```yaml
labels:
    - 'traefik.enable=true'
    - 'traefik.http.routers.eisenhower-matrix.rule=Host(`eisenhower-matrix.ru`)'
    - 'traefik.http.routers.eisenhower-matrix.tls=true'
    - 'traefik.http.routers.eisenhower-matrix.tls.certresolver=letsencrypt'
```

### С Nginx

```nginx
server {
    listen 80;
    server_name eisenhower-matrix.ru;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🐛 Отладка

### Проблемы с запуском

```bash
# Проверка логов
docker-compose logs

# Проверка конфигурации
docker-compose config

# Пересборка без кэша
docker-compose build --no-cache
```

### Проблемы с базой данных

```bash
# Проверка базы данных
docker-compose exec eisenhower-matrix ls -la /app/data/

# Инициализация базы данных
docker-compose exec eisenhower-matrix npm run init-db
```

### Проблемы с производительностью

```bash
# Мониторинг ресурсов
docker stats

# Очистка неиспользуемых образов
docker image prune -f
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose logs -f`
2. Проверьте статус: `docker-compose ps`
3. Обратитесь к автору: alex1c-spb@yandex.ru

## 📝 Лицензия

MIT License - см. файл LICENSE для подробностей.
