#!/bin/bash
# Однострочное исправление проблемы с Vite на Linux сервере

echo "🔧 Исправляем проблему с Vite..."

# Переходим в папку frontend
cd /var/www/eisenhower-matrix/frontend

# Удаляем строку "type": "module" из package.json
sed -i '/"type": "module",/d' package.json

# Проверяем, что строка удалена
if grep -q "type.*module" package.json; then
    echo "❌ Ошибка: строка 'type: module' все еще есть в package.json"
    echo "Попробуйте удалить её вручную:"
    echo "nano package.json"
    exit 1
else
    echo "✅ Строка 'type: module' успешно удалена из package.json"
fi

# Исправляем postcss.config.js
cat > postcss.config.js << 'EOF'
module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
	},
};
EOF

# Исправляем tailwind.config.js
sed -i 's/export default/module.exports =/' tailwind.config.js

echo "✅ Все файлы исправлены!"
echo ""
echo "🚀 Теперь можно запустить:"
echo "   npm run build"
echo ""
echo "📋 Или полный деплой:"
echo "   npm run build && cd .. && npm start"
