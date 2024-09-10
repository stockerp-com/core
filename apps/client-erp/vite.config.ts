import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

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
        if (id.includes('/node_modules/@core/i18n/locales')) {
          return true;
        }
      },
    }),
  ],
  server: {
    port: 4242,
  },
});
