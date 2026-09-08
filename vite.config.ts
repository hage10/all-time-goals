import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: true,
    proxy: {
      '/video-stream': {
        target: 'https://cdn.messiallgoals.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/video-stream/, ''),
        headers: {
          Referer: 'https://messiallgoals.com/',
          Origin: 'https://messiallgoals.com',
        },
      },
    },
  },
});
