import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: path.resolve('./node_modules/react')
    }
  },
  build: {
    chunkSizeWarningLimit: 1500,
    outDir: path.resolve(__dirname, '../c4e_platform/public/hub'),
    emptyOutDir: true,
    target: 'es2015',
    sourcemap: true
  },
  server: {
    proxy: {
      '^/(api|assets|files|app|login|pages|builder_assets|socket.io)': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        ws: true
      }
    }
  }
})
