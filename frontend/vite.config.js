import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/logs': 'http://localhost:4000',
      '/health': 'http://localhost:4000',
      // Proxy WebSocket connections
      '^/ws': {
        target: 'ws://localhost:4000',
        ws: true
      }
    }
  }
})
