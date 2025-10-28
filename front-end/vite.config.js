import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const deploymentId = "AKfycbzdRIDqGM5jhvhVyODNjmW2C8S_fsrAOJYUmcHev9mr5iLTpa1Pu_ZemZbKB-QV6iqg"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  base: '',
  server: {
    proxy: {
      '/api': {
        target: `https://script.google.com/macros/s/${deploymentId}/exec`,
        changeOrigin: true,
        rewrite: (path) => {
          // Remove /api prefix but keep query string intact
          return path.replace(/^\/api/, '')
        },
        secure: false
      }
    }
  }
})
