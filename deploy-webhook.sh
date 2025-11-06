#!/bin/bash

# Webhook script for auto-deployment from GitHub
# Place this in /usr/local/bin/deploy-webhook.sh on the server
# Make it executable: chmod +x /usr/local/bin/deploy-webhook.sh

APP_DIR="/var/www/eisenhower-matrix"
LOG_FILE="/var/log/deploy-webhook.log"

cd "$APP_DIR" || exit 1

echo "$(date): Starting deployment" >> "$LOG_FILE"

# Pull latest changes
git pull origin main >> "$LOG_FILE" 2>&1

# Rebuild and restart containers
docker-compose down >> "$LOG_FILE" 2>&1
docker-compose build --no-cache >> "$LOG_FILE" 2>&1
docker-compose up -d >> "$LOG_FILE" 2>&1

# Clean up unused images
docker system prune -f >> "$LOG_FILE" 2>&1

echo "$(date): Deployment completed" >> "$LOG_FILE"

