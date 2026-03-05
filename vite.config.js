import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 3000,
    strictPort: false,
    allowedHosts: true,
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  build: {
    // wines.js data is large by design — raise limit to avoid noise.
    // Page code-splitting via React.lazy keeps each page chunk small.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          // React + router → separate vendor chunk, cached across deploys
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
