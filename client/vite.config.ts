import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': 'http://192.168.0.174:3001',
      '/portraits': 'http://192.168.0.174:3001',
    },
  },
});
