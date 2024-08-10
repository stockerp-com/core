import { defineConfig } from 'tsup';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/admin-server/index.ts', 'src/client/index.ts'],
  format: ['esm'],
  minify: isProduction,
  sourcemap: true,
  external: [/generated/],
});
