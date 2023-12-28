// vite.config.ts
import { defineConfig } from "file:///C:/GIT/power-note/power-note-ai/node_modules/vite/dist/node/index.js";
import react from "file:///C:/GIT/power-note/power-note-ai/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { crx } from "file:///C:/GIT/power-note/power-note-ai/node_modules/@crxjs/vite-plugin/dist/index.mjs";
import nodePolyfills from "file:///C:/GIT/power-note/power-note-ai/node_modules/vite-plugin-node-stdlib-browser/index.cjs";

// manifest.json
var manifest_default = {
  version: "1.0.0",
  manifest_version: 3,
  name: "Power Note AI",
  description: "This is a Chrome extension built with React and TypeScript",
  action: {
    default_title: "Power Note AI"
  },
  side_panel: {
    default_path: "index.html"
  },
  permissions: [
    "storage",
    "scripting",
    "sidePanel",
    "tabs",
    "popup"
  ],
  background: {
    service_worker: "./src/service-worker/service-worker.ts"
  },
  content_scripts: [
    {
      matches: [
        "<all_urls>"
      ],
      js: [
        "./src/content-script/content.tsx"
      ]
    }
  ],
  icons: {
    "48": "images/logo-transparent.png",
    "128": "images/logo-transparent.png"
  }
};

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [react(), nodePolyfills(), crx({ manifest: manifest_default })]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAibWFuaWZlc3QuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXEdJVFxcXFxwb3dlci1ub3RlXFxcXHBvd2VyLW5vdGUtYWlcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXEdJVFxcXFxwb3dlci1ub3RlXFxcXHBvd2VyLW5vdGUtYWlcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0dJVC9wb3dlci1ub3RlL3Bvd2VyLW5vdGUtYWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djJ1xyXG5pbXBvcnQgeyBjcnggfSBmcm9tICdAY3J4anMvdml0ZS1wbHVnaW4nXHJcbmltcG9ydCBub2RlUG9seWZpbGxzIGZyb20gJ3ZpdGUtcGx1Z2luLW5vZGUtc3RkbGliLWJyb3dzZXInO1xyXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9tYW5pZmVzdC5qc29uJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgbm9kZVBvbHlmaWxscygpLCBjcngoeyBtYW5pZmVzdCB9KV0sXHJcbn0pXHJcbiIsICJ7XHJcbiAgICBcInZlcnNpb25cIjogXCIxLjAuMFwiLFxyXG4gICAgXCJtYW5pZmVzdF92ZXJzaW9uXCI6IDMsXHJcbiAgICBcIm5hbWVcIjogXCJQb3dlciBOb3RlIEFJXCIsXHJcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiVGhpcyBpcyBhIENocm9tZSBleHRlbnNpb24gYnVpbHQgd2l0aCBSZWFjdCBhbmQgVHlwZVNjcmlwdFwiLFxyXG4gICAgXCJhY3Rpb25cIjoge1xyXG4gICAgICAgIFwiZGVmYXVsdF90aXRsZVwiOiBcIlBvd2VyIE5vdGUgQUlcIlxyXG4gICAgfSxcclxuICAgIFwic2lkZV9wYW5lbFwiOiB7XHJcbiAgICAgICAgICAgIFwiZGVmYXVsdF9wYXRoXCI6IFwiaW5kZXguaHRtbFwiXHJcbiAgICB9LFxyXG4gICAgXCJwZXJtaXNzaW9uc1wiOiBbXHJcbiAgICAgICAgXCJzdG9yYWdlXCIsXHJcbiAgICAgICAgXCJzY3JpcHRpbmdcIixcclxuICAgICAgICBcInNpZGVQYW5lbFwiLFxyXG4gICAgICAgIFwidGFic1wiLFxyXG4gICAgICAgIFwicG9wdXBcIlxyXG4gICAgXSxcclxuICAgIFwiYmFja2dyb3VuZFwiOiB7XHJcbiAgICAgICAgXCJzZXJ2aWNlX3dvcmtlclwiOiBcIi4vc3JjL3NlcnZpY2Utd29ya2VyL3NlcnZpY2Utd29ya2VyLnRzXCJcclxuICAgIH0sXHJcbiAgICBcImNvbnRlbnRfc2NyaXB0c1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBcIm1hdGNoZXNcIjogW1xyXG4gICAgICAgICAgICAgICAgXCI8YWxsX3VybHM+XCJcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgXCJqc1wiOiBbXHJcbiAgICAgICAgICAgICAgICBcIi4vc3JjL2NvbnRlbnQtc2NyaXB0L2NvbnRlbnQudHN4XCJcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBcImljb25zXCI6IHtcclxuICAgICAgICBcIjQ4XCI6IFwiaW1hZ2VzL2xvZ28tdHJhbnNwYXJlbnQucG5nXCIsXHJcbiAgICAgICAgXCIxMjhcIjogXCJpbWFnZXMvbG9nby10cmFuc3BhcmVudC5wbmdcIlxyXG4gICAgfVxyXG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UixTQUFTLG9CQUFvQjtBQUNwVCxPQUFPLFdBQVc7QUFDbEIsU0FBUyxXQUFXO0FBQ3BCLE9BQU8sbUJBQW1COzs7QUNIMUI7QUFBQSxFQUNJLFNBQVc7QUFBQSxFQUNYLGtCQUFvQjtBQUFBLEVBQ3BCLE1BQVE7QUFBQSxFQUNSLGFBQWU7QUFBQSxFQUNmLFFBQVU7QUFBQSxJQUNOLGVBQWlCO0FBQUEsRUFDckI7QUFBQSxFQUNBLFlBQWM7QUFBQSxJQUNOLGNBQWdCO0FBQUEsRUFDeEI7QUFBQSxFQUNBLGFBQWU7QUFBQSxJQUNYO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0o7QUFBQSxFQUNBLFlBQWM7QUFBQSxJQUNWLGdCQUFrQjtBQUFBLEVBQ3RCO0FBQUEsRUFDQSxpQkFBbUI7QUFBQSxJQUNmO0FBQUEsTUFDSSxTQUFXO0FBQUEsUUFDUDtBQUFBLE1BQ0o7QUFBQSxNQUNBLElBQU07QUFBQSxRQUNGO0FBQUEsTUFDSjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxPQUFTO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsRUFDWDtBQUNKOzs7QUQ1QkEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLEdBQUcsSUFBSSxFQUFFLDJCQUFTLENBQUMsQ0FBQztBQUN2RCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
