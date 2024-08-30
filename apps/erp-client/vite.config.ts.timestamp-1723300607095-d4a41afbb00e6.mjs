// vite.config.ts
import { defineConfig } from "file:///home/artem/projects/keeplicity/node_modules/vite/dist/node/index.js";
import react from "file:///home/artem/projects/keeplicity/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { TanStackRouterVite } from "file:///home/artem/projects/keeplicity/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import dynamicImport from "file:///home/artem/projects/keeplicity/node_modules/vite-plugin-dynamic-import/dist/index.mjs";
import { imagetools } from "file:///home/artem/projects/keeplicity/node_modules/vite-imagetools/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      routeFilePrefix: "~",
      routesDirectory: "./src/routes",
      generatedRouteTree: "./src/routeTree.gen.ts"
    }),
    dynamicImport({
      filter(id) {
        if (id.includes("/node_modules/@core/i18n/locales")) {
          return true;
        }
      }
    }),
    imagetools()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9hcnRlbS9wcm9qZWN0cy9yZXRhaWxpZnkvYXBwcy9hZG1pbi1jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2FydGVtL3Byb2plY3RzL3JldGFpbGlmeS9hcHBzL2FkbWluLWNsaWVudC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9hcnRlbS9wcm9qZWN0cy9yZXRhaWxpZnkvYXBwcy9hZG1pbi1jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xuaW1wb3J0IHsgVGFuU3RhY2tSb3V0ZXJWaXRlIH0gZnJvbSAnQHRhbnN0YWNrL3JvdXRlci1wbHVnaW4vdml0ZSc7XG5pbXBvcnQgZHluYW1pY0ltcG9ydCBmcm9tICd2aXRlLXBsdWdpbi1keW5hbWljLWltcG9ydCc7XG5pbXBvcnQgeyBpbWFnZXRvb2xzIH0gZnJvbSAndml0ZS1pbWFnZXRvb2xzJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIFRhblN0YWNrUm91dGVyVml0ZSh7XG4gICAgICByb3V0ZUZpbGVQcmVmaXg6ICd+JyxcbiAgICAgIHJvdXRlc0RpcmVjdG9yeTogJy4vc3JjL3JvdXRlcycsXG4gICAgICBnZW5lcmF0ZWRSb3V0ZVRyZWU6ICcuL3NyYy9yb3V0ZVRyZWUuZ2VuLnRzJyxcbiAgICB9KSxcbiAgICBkeW5hbWljSW1wb3J0KHtcbiAgICAgIGZpbHRlcihpZCkge1xuICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9ub2RlX21vZHVsZXMvQHJldGFpbGlmeS9pMThuL2xvY2FsZXMnKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0pLFxuICAgIGltYWdldG9vbHMoKSxcbiAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrVSxTQUFTLG9CQUFvQjtBQUMvVixPQUFPLFdBQVc7QUFDbEIsU0FBUywwQkFBMEI7QUFDbkMsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUyxrQkFBa0I7QUFHM0IsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sbUJBQW1CO0FBQUEsTUFDakIsaUJBQWlCO0FBQUEsTUFDakIsaUJBQWlCO0FBQUEsTUFDakIsb0JBQW9CO0FBQUEsSUFDdEIsQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBLE1BQ1osT0FBTyxJQUFJO0FBQ1QsWUFBSSxHQUFHLFNBQVMsdUNBQXVDLEdBQUc7QUFDeEQsaUJBQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLElBQ0QsV0FBVztBQUFBLEVBQ2I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
