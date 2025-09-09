# Инструкция по деплою на Linux сервер

## Проблема и решение

### Проблема

При запуске `npm run build` на Linux сервере возникала ошибка:

```
SyntaxError: missing ) after argument list
at ModuleLoader.moduleStrategy (node:internal/modules/esm/translators:168:18)
```

### Причина

Конфликт между `"type": "module"` в package.json и bash-скриптами Vite в Linux окружении.

### Решение

1. **Убрать `"type": "module"`** из `frontend/package.json`
2. **Изменить конфигурационные файлы** на CommonJS синтаксис

## Изменения в файлах

### 1. frontend/package.json

```json
{
	"name": "eisenhower-matrix-frontend",
	"private": true,
	"version": "0.0.0",
	// Убрана строка: "type": "module",
	"scripts": {
		"dev": "npx vite",
		"build": "npx vite build",
		"lint": "npx eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
		"preview": "npx vite preview"
	}
}
```

### 2. frontend/postcss.config.js

```javascript
// Было:
export default {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
	},
};

// Стало:
module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
	},
};
```

### 3. frontend/tailwind.config.js

```javascript
// Было:
export default {

// Стало:
module.exports = {
```

## Команды для деплоя

### На Linux сервере:

```bash
# 1. Перейти в папку проекта
cd /var/www/eisenhower-matrix

# 2. Установить зависимости
npm install

# 3. Собрать frontend
cd frontend
npm install
npm run build

# 4. Запустить backend
cd ..
npm start
```

### Альтернативный способ (если есть скрипт build в корне):

```bash
# В корне проекта
npm run build
```

## Результат

-   ✅ Build проходит успешно
-   ✅ Все файлы генерируются в `frontend/dist/`
-   ✅ Приложение готово к работе

## Предупреждения (не критично)

-   `The CJS build of Vite's Node API is deprecated` - это предупреждение, не ошибка
-   Приложение работает корректно

## Проверка

После успешного build в папке `frontend/dist/` должны быть файлы:

-   `index.html`
-   `assets/index-*.css`
-   `assets/index-*.js`
-   `assets/vendor-*.js`
-   `assets/dnd-*.js`
-   `assets/charts-*.js`
