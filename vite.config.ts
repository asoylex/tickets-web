import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const apiTarget = process.env.VITE_PROXY_TARGET ?? 'http://localhost:3000'

export default defineConfig({
  resolve: {
    alias: { '@': '/src' },
  },
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
    },
  },
})
