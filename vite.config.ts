/// <reference types="vitest" />

import react from "@vitejs/plugin-react-swc";
import million from "million/compiler";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    million.vite({ auto: { rsc: true } }),
    react(),

    tsconfigPaths(),

    visualizer({
      filename: "bundle-analysis.html",
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
