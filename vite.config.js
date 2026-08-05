import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/unified-studio/', // Preserves your custom base path
  server: {
    port: 5173,
    proxy: {
      // Any request starting with /api will be routed to Flask on port 5000
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
