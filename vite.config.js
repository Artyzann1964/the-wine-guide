import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'The Wine Guide',
        short_name: 'Wine Guide',
        description: 'Your personal wine companion — explore, collect, and track wines.',
        theme_color: '#1e293b',
        background_color: '#FAF8F4',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,woff,woff2}'],
        globIgnores: ['**/*.{png,jpg,jpeg,webp}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/upload\.wikimedia\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'wikimedia-images',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
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
  test: {
    environment: 'node',
    include: ['src/__tests__/**/*.test.js'],
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
