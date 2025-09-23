import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Fix for Supabase Realtime WebSocket compatibility in browser
      "ws": path.resolve(__dirname, "./src/utils/ws-shim.js"),
    },
  },
  define: {
    global: "globalThis",
    // Add process.env fallback for browser compatibility
    "process.env": {},
  },
  optimizeDeps: {
    exclude: ["ws"],
    include: ["@supabase/supabase-js"],
  },
}));
