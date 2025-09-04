#!/bin/bash

# Скрипт для развертывания приложения Матрица Эйзенхауэра через Docker

set -e

echo "🚀 Начинаем развертывание приложения Матрица Эйзенхауэра..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    error "Docker не установлен. Установите Docker и попробуйте снова."
    exit 1
fi

# Проверяем наличие Docker Compose
if ! command -v docker-compose &> /dev/null; then
    error "Docker Compose не установлен. Установите Docker Compose и попробуйте снова."
    exit 1
fi

log "Останавливаем существующие контейнеры..."
docker-compose down || true

log "Удаляем старые образы..."
docker image prune -f || true

log "Собираем новый образ..."
docker-compose build --no-cache

log "Запускаем контейнеры..."
docker-compose up -d

log "Ожидаем запуска приложения..."
sleep 10

# Проверяем статус контейнера
if docker-compose ps | grep -q "Up"; then
    success "Приложение успешно запущено!"
    
    log "Информация о контейнере:"
    docker-compose ps
    
    log "Логи приложения:"
    docker-compose logs --tail=20
    
    echo ""
    success "🌐 Приложение доступно по адресу: http://localhost:3000"
    success "📊 Статус контейнера: $(docker-compose ps --services --filter "status=running")"
    
    echo ""
    log "Полезные команды:"
    echo "  Просмотр логов: docker-compose logs -f"
    echo "  Остановка: docker-compose down"
    echo "  Перезапуск: docker-compose restart"
    echo "  Обновление: ./docker-deploy.sh"
    
else
    error "Не удалось запустить приложение. Проверьте логи:"
    docker-compose logs
    exit 1
fi
