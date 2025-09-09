#!/bin/bash

# Скрипт для исправления конфигурации на Linux сервере
# Запускать из корневой папки проекта: /var/www/eisenhower-matrix

echo "🔧 Исправление конфигурации для Linux сервера..."

# 1. Исправляем frontend/package.json - убираем "type": "module"
echo "📝 Исправляем frontend/package.json..."
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

# 2. Исправляем frontend/postcss.config.js - используем CommonJS
echo "📝 Исправляем frontend/postcss.config.js..."
cat > frontend/postcss.config.js << 'EOF'
module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
	},
};
EOF

# 3. Исправляем frontend/tailwind.config.js - используем CommonJS
echo "📝 Исправляем frontend/tailwind.config.js..."
cat > frontend/tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: [
					'Inter',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'sans-serif',
				],
				mono: [
					'JetBrains Mono',
					'SF Mono',
					'Monaco',
					'Consolas',
					'Liberation Mono',
					'Courier New',
					'monospace',
				],
			},
			fontSize: {
				xs: ['0.75rem', { lineHeight: '1rem' }],
				sm: ['0.875rem', { lineHeight: '1.25rem' }],
				base: ['1rem', { lineHeight: '1.5rem' }],
				lg: ['1.125rem', { lineHeight: '1.75rem' }],
				xl: ['1.25rem', { lineHeight: '1.75rem' }],
				'2xl': ['1.5rem', { lineHeight: '2rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
			},
			boxShadow: {
				soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
				medium: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				large: '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
				glow: '0 0 20px rgba(59, 130, 246, 0.3)',
				'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
				'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
			},
			borderRadius: {
				xl: '0.75rem',
				'2xl': '1rem',
				'3xl': '1.5rem',
			},
			colors: {
				primary: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
				},
				secondary: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
				},
				quadrant: {
					urgent: '#ef4444',
					important: '#f59e0b',
					both: '#dc2626',
					neither: '#6b7280',
				},
				neon: {
					blue: '#00ffff',
					pink: '#ff00ff',
					green: '#00ff00',
					yellow: '#ffff00',
					purple: '#8000ff',
				},
				retro: {
					gray: '#c0c0c0',
					darkGray: '#808080',
					lightGray: '#dfdfdf',
					white: '#ffffff',
					black: '#000000',
				},
			},
			animation: {
				'fade-in': 'fadeIn 0.3s ease-in-out',
				'slide-in': 'slideIn 0.3s ease-out',
				'bounce-in': 'bounceIn 0.5s ease-out',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideIn: {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				bounceIn: {
					'0%': { transform: 'scale(0.3)', opacity: '0' },
					'50%': { transform: 'scale(1.05)' },
					'70%': { transform: 'scale(0.9)' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
			},
		},
	},
	plugins: [],
};
EOF

# 4. Исправляем корневой package.json - добавляем скрипт "start"
echo "📝 Исправляем корневой package.json..."
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

echo "✅ Все файлы исправлены!"
echo ""
echo "🚀 Теперь можно запустить деплой:"
echo "   npm install"
echo "   cd frontend && npm install && npm run build"
echo "   cd .. && npm start"
echo ""
echo "📋 Или одной командой:"
echo "   npm run build && npm start"
