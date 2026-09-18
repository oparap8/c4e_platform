import path from 'node:path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src')
    },
  },
   build: {
    chunkSizeWarningLimit: 1500,
    outDir: path.resolve(__dirname, "../c4e_platform/public/hub"),
    emptyOutDir: true,
    target: "es2015",
    sourcemap: true,
  },
  server: {
    proxy: {
      "^/(api|assets|files|app|login|pages|builder_assets|socket.io)": {
        target: "http://localhost:8000",
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
