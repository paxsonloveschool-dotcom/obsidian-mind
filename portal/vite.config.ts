import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: "src/dashboard",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 4980,
    proxy: {
      "/api": "http://localhost:4981",
      "/ws": {
        target: "ws://localhost:4981",
        ws: true,
      },
    },
  },
  build: {
    outDir: "../../dist/dashboard",
  },
});
