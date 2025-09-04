#!/bin/bash

# Скрипт для тестирования разных вариантов Dockerfile

set -e

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

# Очистка предыдущих тестов
cleanup() {
    log "Очистка предыдущих тестов..."
    docker stop eisenhower-test-* 2>/dev/null || true
    docker rm eisenhower-test-* 2>/dev/null || true
    docker rmi eisenhower-matrix:test-* 2>/dev/null || true
}

# Тест основного Dockerfile
test_main() {
    log "Тестирование основного Dockerfile..."
    
    if docker build -f Dockerfile -t eisenhower-matrix:test-main .; then
        success "Основной Dockerfile собран успешно"
        
        # Тест запуска
        if docker run -d -p 3001:3000 --name eisenhower-test-main eisenhower-matrix:test-main; then
            sleep 5
            if docker ps | grep -q eisenhower-test-main; then
                success "Основной контейнер запущен успешно"
                docker stop eisenhower-test-main
                docker rm eisenhower-test-main
            else
                error "Основной контейнер не запустился"
                docker logs eisenhower-test-main
            fi
        else
            error "Не удалось запустить основной контейнер"
        fi
    else
        error "Не удалось собрать основной Dockerfile"
    fi
}

# Тест альтернативного Dockerfile
test_alternative() {
    log "Тестирование альтернативного Dockerfile..."
    
    if docker build -f Dockerfile.alternative -t eisenhower-matrix:test-alt .; then
        success "Альтернативный Dockerfile собран успешно"
        
        # Тест запуска
        if docker run -d -p 3002:3000 --name eisenhower-test-alt eisenhower-matrix:test-alt; then
            sleep 5
            if docker ps | grep -q eisenhower-test-alt; then
                success "Альтернативный контейнер запущен успешно"
                docker stop eisenhower-test-alt
                docker rm eisenhower-test-alt
            else
                error "Альтернативный контейнер не запустился"
                docker logs eisenhower-test-alt
            fi
        else
            error "Не удалось запустить альтернативный контейнер"
        fi
    else
        error "Не удалось собрать альтернативный Dockerfile"
    fi
}

# Тест Dockerfile с better-sqlite3
test_better_sqlite3() {
    log "Тестирование Dockerfile с better-sqlite3..."
    
    if docker build -f Dockerfile.better-sqlite3 -t eisenhower-matrix:test-better .; then
        success "Dockerfile с better-sqlite3 собран успешно"
        
        # Тест запуска
        if docker run -d -p 3003:3000 --name eisenhower-test-better eisenhower-matrix:test-better; then
            sleep 5
            if docker ps | grep -q eisenhower-test-better; then
                success "Контейнер с better-sqlite3 запущен успешно"
                docker stop eisenhower-test-better
                docker rm eisenhower-test-better
            else
                error "Контейнер с better-sqlite3 не запустился"
                docker logs eisenhower-test-better
            fi
        else
            error "Не удалось запустить контейнер с better-sqlite3"
        fi
    else
        error "Не удалось собрать Dockerfile с better-sqlite3"
    fi
}

# Основная функция
main() {
    log "Начинаем тестирование Dockerfile вариантов..."
    
    cleanup
    
    test_main
    echo ""
    test_alternative
    echo ""
    test_better_sqlite3
    
    log "Тестирование завершено!"
    
    echo ""
    log "Доступные образы:"
    docker images | grep eisenhower-matrix
    
    echo ""
    log "Рекомендации:"
    echo "1. Если основной Dockerfile работает - используйте его"
    echo "2. Если есть проблемы с SQLite3 - попробуйте альтернативный"
    echo "3. Для максимальной стабильности - используйте better-sqlite3"
}

# Запуск
main "$@"
