import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Split vendor chunks for better browser caching
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — changes rarely, long-term cache
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Icons bundle — large but cacheable
          'vendor-icons': ['lucide-react'],
          // HTTP client
          'vendor-axios': ['axios'],
        },
      },
    },
    // Raise the chunk size warning threshold
    chunkSizeWarningLimit: 800,
    // Enable source map for easier debugging (disable in production if needed)
    sourcemap: false,
  },
});
