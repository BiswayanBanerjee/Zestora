import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],

  // ✅ Prevent Vite from trying to pre-bundle mapbox-gl (which react-map-gl references internally)
  optimizeDeps: {
    exclude: ["mapbox-gl"],
  },

  // ✅ Redirect all mapbox-gl imports to maplibre-gl
  resolve: {
    alias: {
      "mapbox-gl": "maplibre-gl",
    },
  },
});
