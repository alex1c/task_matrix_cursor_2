import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		proxy: {
			'/api': {
				target: 'http://localhost:5000',
				changeOrigin: true,
			},
		},
	},
	build: {
		outDir: 'dist',
		assetsDir: 'assets',
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom'],
					dnd: [
						'@dnd-kit/core',
						'@dnd-kit/sortable',
						'@dnd-kit/utilities',
					],
					charts: ['recharts'],
				},
			},
		},
	},
	define: {
		// Support for next-intl in Vite
		'process.env': process.env,
	},
});
