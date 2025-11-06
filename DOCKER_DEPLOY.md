# Инструкция по деплою на Ubuntu сервер с Docker

## Предварительные требования

1. Ubuntu 20.04+ сервер
2. Docker и Docker Compose установлены
3. Git установлен
4. Доступ по SSH

## Шаги установки

### 1. Установка Docker и Docker Compose

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER

# Перезагрузка сессии (или выйдите и войдите снова)
newgrp docker
```

### 2. Клонирование репозитория

```bash
cd /var/www
sudo git clone https://github.com/alex1c/task_matrix_cursor_2.git eisenhower-matrix
cd eisenhower-matrix
sudo chown -R $USER:$USER .
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```bash
cd /var/www/eisenhower-matrix
nano .env
```

Добавьте следующие переменные (замените на ваши значения):

```env
# CORS origin - домен вашего сайта или IP
CORS_ORIGIN=http://your-domain.com

# Или если используете IP:
# CORS_ORIGIN=http://YOUR_SERVER_IP

# Frontend port (по умолчанию 80)
FRONTEND_PORT=80

# Database path (по умолчанию /app/data/database.sqlite)
DB_PATH=/app/data/database.sqlite

# Node environment
NODE_ENV=production
```

### 4. Остановка Apache (если запущен)

```bash
# Остановить Apache
sudo systemctl stop apache2

# Отключить автозапуск Apache (опционально)
sudo systemctl disable apache2
```

### 5. Сборка и запуск Docker контейнеров

```bash
cd /var/www/eisenhower-matrix

# Сборка образов
docker-compose build

# Запуск контейнеров
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

### 6. Настройка автоматического обновления

#### Вариант A: GitHub Actions (Рекомендуется)

1. **Создайте SSH ключ для деплоя:**

```bash
# На вашем локальном компьютере или на сервере
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

2. **Добавьте публичный ключ на сервер:**

```bash
# Скопируйте публичный ключ на сервер
cat ~/.ssh/github_actions_deploy.pub | ssh user@your-server "cat >> ~/.ssh/authorized_keys"
```

3. **Добавьте secrets в GitHub:**
   - Перейдите в репозиторий: https://github.com/alex1c/task_matrix_cursor_2
   - Settings → Secrets and variables → Actions → New repository secret
   - Добавьте следующие secrets:
     - `SERVER_HOST` - IP адрес или домен вашего сервера
     - `SERVER_USER` - пользователь для SSH (например, `ubuntu` или `root`)
     - `SSH_PRIVATE_KEY` - содержимое приватного ключа (`~/.ssh/github_actions_deploy`)

4. **Workflow автоматически запустится при push в main ветку**

#### Вариант B: GitHub Webhook

1. **Установите Node.js на сервере (если еще не установлен):**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. **Установите PM2 для управления процессом:**

```bash
sudo npm install -g pm2
```

3. **Настройте webhook сервер:**

```bash
cd /var/www/eisenhower-matrix

# Установите зависимости для webhook сервера
npm install express

# Запустите webhook сервер через PM2
pm2 start webhook-server.js --name webhook-server
pm2 save
pm2 startup
```

4. **Скопируйте скрипт деплоя:**

```bash
sudo cp deploy-webhook.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/deploy-webhook.sh
```

5. **Настройте GitHub Webhook:**
   - Перейдите в репозиторий: https://github.com/alex1c/task_matrix_cursor_2
   - Settings → Webhooks → Add webhook
   - Payload URL: `http://YOUR_SERVER_IP:9000/webhook`
   - Content type: `application/json`
   - Secret: ваш секретный ключ (должен совпадать с `WEBHOOK_SECRET` в `webhook-server.js`)
   - Events: выберите "Just the push event"

6. **Откройте порт для webhook (если используется firewall):**

```bash
sudo ufw allow 9000/tcp
```

### 7. Настройка Nginx как reverse proxy (опционально)

Если хотите использовать Nginx на хосте вместо встроенного в контейнере:

```bash
sudo apt install nginx
```

Создайте конфигурацию `/etc/nginx/sites-available/eisenhower-matrix`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/eisenhower-matrix /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Настройка SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Или если используете встроенный Nginx в контейнере, используйте:

```bash
sudo certbot certonly --standalone -d your-domain.com
```

Затем обновите `nginx-docker.conf` для поддержки SSL.

### 9. Настройка firewall

```bash
# Разрешить HTTP и HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Если используете webhook
sudo ufw allow 9000/tcp

# Включить firewall
sudo ufw enable
```

## Полезные команды

### Управление контейнерами

```bash
# Перезапуск контейнеров
docker-compose restart

# Остановка
docker-compose down

# Остановка с удалением volumes (ОСТОРОЖНО - удалит базу данных!)
docker-compose down -v

# Обновление после git pull
docker-compose up -d --build

# Просмотр логов
docker-compose logs backend
docker-compose logs frontend
docker-compose logs -f  # следить за логами в реальном времени

# Просмотр статуса
docker-compose ps
```

### Вход в контейнеры

```bash
# Вход в backend контейнер
docker exec -it eisenhower-backend sh

# Вход в frontend контейнер
docker exec -it eisenhower-frontend sh
```

### Резервное копирование базы данных

```bash
# Создать резервную копию
docker exec eisenhower-backend cat /app/database.sqlite > backup-$(date +%Y%m%d).sqlite

# Или если используете volume
docker run --rm -v eisenhower-matrix_backend-data:/data -v $(pwd):/backup alpine tar czf /backup/backup-$(date +%Y%m%d).tar.gz /data
```

### Мониторинг

```bash
# Использование ресурсов
docker stats

# Проверка здоровья контейнеров
docker-compose ps
```

## Устранение проблем

### Контейнеры не запускаются

```bash
# Проверьте логи
docker-compose logs

# Проверьте статус
docker-compose ps

# Пересоберите образы
docker-compose build --no-cache
docker-compose up -d
```

### Проблемы с базой данных

```bash
# Проверьте права доступа
docker exec eisenhower-backend ls -la /app/data

# Проверьте логи backend
docker-compose logs backend
```

### Проблемы с CORS

Убедитесь, что в `.env` файле правильно указан `CORS_ORIGIN`:

```env
CORS_ORIGIN=http://your-domain.com
```

### Проблемы с портами

Если порт 80 занят:

```bash
# Проверьте, что использует порт 80
sudo lsof -i :80

# Измените порт в docker-compose.yml или .env
FRONTEND_PORT=8080
```

## Обновление приложения

### Ручное обновление

```bash
cd /var/www/eisenhower-matrix
git pull origin main
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Автоматическое обновление

При использовании GitHub Actions или Webhook, обновление происходит автоматически при push в main ветку.

## Дополнительная информация

- Репозиторий: https://github.com/alex1c/task_matrix_cursor_2
- Документация Docker: https://docs.docker.com/
- Документация Docker Compose: https://docs.docker.com/compose/

