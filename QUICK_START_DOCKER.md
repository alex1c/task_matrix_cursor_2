# Быстрый старт Docker деплоя

## На сервере Ubuntu выполните:

```bash
# 1. Установите Docker и Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo usermod -aG docker $USER
newgrp docker

# 2. Клонируйте репозиторий
cd /var/www
sudo git clone https://github.com/alex1c/task_matrix_cursor_2.git eisenhower-matrix
cd eisenhower-matrix
sudo chown -R $USER:$USER .

# 3. Создайте файл .env
cp env.example .env
nano .env
# Отредактируйте CORS_ORIGIN на ваш домен или IP

# 4. Остановите Apache (если запущен)
sudo systemctl stop apache2

# 5. Запустите Docker контейнеры
docker-compose build
docker-compose up -d

# 6. Проверьте статус
docker-compose ps
docker-compose logs -f
```

## Настройка автоматического обновления

### Вариант 1: GitHub Actions (рекомендуется)

1. Создайте SSH ключ для деплоя
2. Добавьте публичный ключ на сервер в `~/.ssh/authorized_keys`
3. В GitHub репозитории добавьте Secrets:
   - `SERVER_HOST` - IP или домен сервера
   - `SERVER_USER` - пользователь для SSH
   - `SSH_PRIVATE_KEY` - приватный ключ

### Вариант 2: GitHub Webhook

```bash
# Установите Node.js и PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2

# Установите зависимости и запустите webhook сервер
cd /var/www/eisenhower-matrix
npm install express
sudo cp deploy-webhook.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/deploy-webhook.sh
pm2 start webhook-server.js --name webhook-server
pm2 save
pm2 startup

# Настройте webhook в GitHub:
# Settings → Webhooks → Add webhook
# Payload URL: http://YOUR_SERVER_IP:9000/webhook
```

Подробная инструкция в файле `DOCKER_DEPLOY.md`

