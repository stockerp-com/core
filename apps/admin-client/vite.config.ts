import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import dynamicImport from 'vite-plugin-dynamic-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      routeFilePrefix: '~',
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    dynamicImport({
      filter(id) {
        if (id.includes('/node_modules/@retailify/i18n/locales')) {
          return true;
        }
      },
    }),
  ],
});
