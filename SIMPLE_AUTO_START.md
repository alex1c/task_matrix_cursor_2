# Простой автоматический запуск приложения todolist.su

## 🚀 Быстрый старт

### 1. Установить автоматический запуск:

```bash
# Скопировать файлы на сервер
sudo cp auto-start.sh /var/www/eisenhower-matrix/
sudo cp install-auto-start.sh /var/www/eisenhower-matrix/

# Установить автоматический запуск
cd /var/www/eisenhower-matrix
sudo ./install-auto-start.sh
```

### 2. Запустить приложение сейчас:

```bash
sudo systemctl start todolist-auto-start
```

### 3. Проверить статус:

```bash
sudo systemctl status todolist-auto-start
```

## 📋 Что делает скрипт

1. **Останавливает Nginx** (если запущен)
2. **Запускает Apache**
3. **Убивает старые процессы Node.js**
4. **Запускает бэкенд** (порт 5000)
5. **Проверяет работоспособность** всех компонентов

## 🔧 Управление

```bash
# Запустить приложение
sudo systemctl start todolist-auto-start

# Остановить приложение
sudo systemctl stop todolist-auto-start

# Проверить статус
sudo systemctl status todolist-auto-start

# Посмотреть логи
sudo journalctl -u todolist-auto-start -f

# Отключить автозапуск
sudo systemctl disable todolist-auto-start
```

## 🎯 Результат

После установки приложение будет автоматически запускаться после каждой перезагрузки сервера.

**Сайт будет доступен по адресу:** https://todolist.su/

## 🆘 Если что-то не работает

```bash
# Проверить логи
sudo journalctl -u todolist-auto-start -f

# Запустить вручную для диагностики
cd /var/www/eisenhower-matrix
sudo ./auto-start.sh
```
