import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import proxyOptions from './proxyOptions'

export default defineConfig({
	plugins: [vue()],
	server: {
		port: 8080,
		host: '0.0.0.0',
		proxy: proxyOptions,
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
	build: {
		outDir: '../public/dashboard',
		emptyOutDir: true,
		target: 'es2015',
		rollupOptions: {
			output: {
				entryFileNames: 'assets/index.js',
				chunkFileNames: 'assets/[name].js',
				assetFileNames: 'assets/[name].[ext]',
			},
		},
	},
})
