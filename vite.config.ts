import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    open: true,
    proxy: {
      "/api/v1": {
        // target: "http://10.176.42.153:2048/api/v1",
        target: "http://127.0.0.1:8000/",
        changeOrigin: true,
        rewrite: (path) => {
          console.log(path);
          console.log(path.replace(/^\/api\/v1/, ""));
          return path.replace(/^\/api\/v1/, "");
        },
      },
    },
  },
});
