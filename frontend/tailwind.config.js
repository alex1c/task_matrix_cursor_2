/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// Спокойная цветовая палитра
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
				// Цвета для квадрантов матрицы Эйзенхауэра
				quadrant: {
					urgent: '#ef4444', // Красный для срочно
					important: '#f59e0b', // Оранжевый для важно
					both: '#dc2626', // Темно-красный для важно и срочно
					neither: '#6b7280', // Серый для не важно и не срочно
				},
				// Неоновая тема
				neon: {
					blue: '#00ffff',
					pink: '#ff00ff',
					green: '#00ff00',
					yellow: '#ffff00',
					purple: '#8000ff',
				},
				// Ретро тема (Windows 98)
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

