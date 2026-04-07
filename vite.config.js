import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'docs',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/index.html'),
        services: resolve(__dirname, 'services/index.html'),
        financialStrategy: resolve(__dirname, 'services/financial-strategy/index.html'),
        businessStrategy: resolve(__dirname, 'services/business-strategy/index.html'),
        operationalExcellence: resolve(__dirname, 'services/operational-excellence/index.html'),
        capacityBuilding: resolve(__dirname, 'services/capacity-building/index.html'),
        aiIntegration: resolve(__dirname, 'services/ai-integration/index.html'),
        insights: resolve(__dirname, 'insights/index.html'),
        article: resolve(__dirname, 'insights/article/index.html'),
        contact: resolve(__dirname, 'contact/index.html'),
      },
    },
  },
});
