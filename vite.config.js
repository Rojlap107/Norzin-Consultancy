import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/index.html'),
        services: resolve(__dirname, 'services/index.html'),
        insights: resolve(__dirname, 'insights/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
});
