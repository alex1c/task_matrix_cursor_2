# Простое исправление ошибки Vite на Linux сервере

## Проблема

Ошибка указывает на bash-скрипт Vite:

```
file:///var/www/eisenhower-matrix/frontend/node_modules/vite/bin/vite.js:2
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")
          ^^^^^^^
SyntaxError: missing ) after argument list
```

## Причина

В `frontend/package.json` все еще есть строка `"type": "module"`, из-за которой Node.js пытается выполнить bash-скрипт как ES модуль.

## Простое решение

### 1. Проверить, есть ли проблема

```bash
cd /var/www/eisenhower-matrix/frontend
grep -n "type.*module" package.json
```

Если команда выводит что-то вроде `5:  "type": "module",`, то проблема найдена.

### 2. Исправить проблему

```bash
cd /var/www/eisenhower-matrix/frontend

# Удалить строку "type": "module"
sed -i '/"type": "module",/d' package.json

# Проверить, что строка удалена
grep -n "type.*module" package.json
# Должно быть пусто (ничего не выводится)
```

### 3. Запустить build

```bash
npm run build
```

## Альтернативное решение (если sed не работает)

### Вариант 1: Редактировать файл вручную

```bash
cd /var/www/eisenhower-matrix/frontend
nano package.json
# Найти строку "type": "module", и удалить её
# Сохранить файл (Ctrl+X, Y, Enter)
```

### Вариант 2: Пересоздать package.json

```bash
cd /var/www/eisenhower-matrix/frontend

# Создать новый package.json без "type": "module"
cat > package.json << 'EOF'
{
  "name": "eisenhower-matrix-frontend",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "npx vite",
    "build": "npx vite build",
    "lint": "npx eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "npx vite preview"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "date-fns": "^2.30.0",
    "lucide-react": "^0.294.0",
    "next-intl": "^4.3.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-helmet-async": "^2.0.5",
    "react-hot-toast": "^2.4.1",
    "recharts": "^2.8.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
EOF
```

## Проверка результата

После исправления:

```bash
# Проверить, что "type": "module" удален
grep "type.*module" package.json
# Должно быть пусто

# Запустить build
npm run build
# Должно пройти успешно
```

## Если проблема все еще есть

Возможно, нужно также исправить конфигурационные файлы:

```bash
cd /var/www/eisenhower-matrix/frontend

# Исправить postcss.config.js
cat > postcss.config.js << 'EOF'
module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
	},
};
EOF

# Исправить tailwind.config.js
sed -i 's/export default/module.exports =/' tailwind.config.js
```

## Ожидаемый результат

После исправления:

-   ✅ `npm run build` проходит без ошибок
-   ✅ Создается папка `dist/` с файлами
-   ✅ Приложение готово к работе
