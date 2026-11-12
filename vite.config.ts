import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const apiProxy = {
  '/api': {
    target: 'https://pebnews.pebnews.com',
    changeOrigin: true,
    secure: true,
  },
  '/sanctum': {
    target: 'https://pebnews.pebnews.com',
    changeOrigin: true,
    secure: true,
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
})
