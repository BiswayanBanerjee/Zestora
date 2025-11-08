import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    exclude: ["mapbox-gl"],
  },
  resolve: {
    alias: {
      "mapbox-gl": "maplibre-gl",
    },
  },

  // 👇 ensure _redirects is copied into dist/
  build: {
    rollupOptions: {},
  },
  publicDir: "public",
  assetsInclude: ["**/_redirects"], // <-- add this line
});
