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
        target: "http://10.176.42.152:8000",
        // target: "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => {
          console.log('original',path)
          // return path.replace(/^\/api\/v1/, "");1
          return path
        },
        bypass(req, res, options: any) {
          const proxyURL = options.target + options.rewrite(req.url);
          console.log(new Date(),'proxyURL', proxyURL);
          req.headers['x-req-proxyURL'] = proxyURL; // 设置未生效
          res.setHeader('x-req-proxyURL', proxyURL); // 设置响应头可以看到
        },
      },  
    },
  },
});
