import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true, // CORS_ORIGINS de la API espera este puerto
    proxy: { "/api": "http://localhost:5000" },
  },
  build: { outDir: "build" },
  test: { environment: "jsdom", globals: true },
});
