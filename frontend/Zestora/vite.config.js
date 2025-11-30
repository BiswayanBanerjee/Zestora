import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "stats.html",
      template: "treemap", // or "sunburst"
      gzipSize: true,
      brotliSize: true,
      open: true, // auto-open browser
    }),
  ],

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
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          mui: ["@mui/material", "@mui/icons-material"],
          redux: ["@reduxjs/toolkit", "react-redux"],
          supabase: ["@supabase/supabase-js"],
          firebase: ["firebase/app", "firebase/auth"],
        },
      },
    },
  },
  publicDir: "public",
  assetsInclude: ["**/_redirects"], // <-- add this line
});
