import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy local requests starting with /n8n to the remote n8n host.
      // In your .env set VITE_N8N_WEBHOOK_URL to '/n8n/webhook/your-webhook-id'
      // Example target: https://ct070303.app.n8n.cloud
      '/n8n': {
        target: 'https://ct070303.app.n8n.cloud',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/n8n/, ''),
      },
      // Proxy local /api calls to backend to avoid CORS in development
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})

