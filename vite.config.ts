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
      // Alias ws to our browser-compatible shim
      "ws": path.resolve(__dirname, "./src/utils/ws-shim.js"),
    },
  },
  define: {
    // Define global for browser compatibility
    global: 'globalThis',
  },
  optimizeDeps: {
    // Exclude ws from pre-bundling to use our shim
    exclude: ['ws'],
  },
}));
