# Быстрое исправление на Linux сервере

## Проблема

Ошибка: `SyntaxError: missing ) after argument list` при запуске `npm run build`

## Быстрое решение

### Вариант 1: Использовать готовый скрипт

```bash
# 1. Перейти в папку проекта
cd /var/www/eisenhower-matrix

# 2. Скачать и запустить скрипт исправления
wget https://raw.githubusercontent.com/your-repo/fix-linux-server.sh
chmod +x fix-linux-server.sh
./fix-linux-server.sh

# 3. Запустить деплой
npm run build && npm start
```

### Вариант 2: Выполнить команды вручную

```bash
# 1. Перейти в папку проекта
cd /var/www/eisenhower-matrix

# 2. Исправить frontend/package.json (убрать "type": "module")
sed -i '/"type": "module",/d' frontend/package.json

# 3. Исправить frontend/postcss.config.js
cat > frontend/postcss.config.js << 'EOF'
module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
	},
};
EOF

# 4. Исправить frontend/tailwind.config.js
sed -i 's/export default/module.exports =/' frontend/tailwind.config.js

# 5. Добавить скрипт "start" в корневой package.json
sed -i '/"build": "cd frontend && npm run build",/a\    "start": "cd backend && npm start",' package.json

# 6. Запустить деплой
npm run build && npm start
```

### Вариант 3: Полная перезапись файлов

```bash
# 1. Перейти в папку проекта
cd /var/www/eisenhower-matrix

# 2. Создать исправленный frontend/package.json
cat > frontend/package.json << 'EOF'
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

# 3. Создать исправленный frontend/postcss.config.js
cat > frontend/postcss.config.js << 'EOF'
module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
	},
};
EOF

# 4. Создать исправленный frontend/tailwind.config.js
cat > frontend/tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
				mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
			},
			colors: {
				primary: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e' },
				secondary: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
				quadrant: { urgent: '#ef4444', important: '#f59e0b', both: '#dc2626', neither: '#6b7280' },
				neon: { blue: '#00ffff', pink: '#ff00ff', green: '#00ff00', yellow: '#ffff00', purple: '#8000ff' },
				retro: { gray: '#c0c0c0', darkGray: '#808080', lightGray: '#dfdfdf', white: '#ffffff', black: '#000000' },
			},
		},
	},
	plugins: [],
};
EOF

# 5. Создать исправленный корневой package.json
cat > package.json << 'EOF'
{
  "name": "eisenhower-matrix",
  "version": "1.0.0",
  "description": "Eisenhower Matrix Kanban Board Application",
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "cd frontend && npm run build",
    "start": "cd backend && npm start",
    "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

# 6. Запустить деплой
npm run build && npm start
```

## Проверка результата

После выполнения любого из вариантов:

```bash
# Проверить, что build проходит успешно
npm run build

# Если build прошел успешно, запустить приложение
npm start
```

## Ожидаемый результат

-   ✅ Build проходит без ошибок
-   ✅ Создается папка `frontend/dist/` с файлами
-   ✅ Приложение запускается на порту 5000
-   ✅ Frontend доступен на порту 3000 (в dev режиме)
