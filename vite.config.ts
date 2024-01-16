/// <reference types="vitest" />

import react from '@vitejs/plugin-react-swc';
import million from 'million/compiler';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    million.vite({ auto: { rsc: true } }),
    react(),

    Icons({
      compiler: 'jsx',
      customCollections: {
        icons: FileSystemIconLoader('./src/assets/icons', (svg) =>
          svg.replace(/^<svg /, '<svg fill="currentColor" '),
        ),
      },
    }),
    AutoImport({
      eslintrc: {
        enabled: true,
      },
      dts: true,
      imports: ['react', 'rxjs', 'date-fns'],
      resolvers: [
        IconsResolver({
          prefix: 'Icons',
          extension: 'jsx',
        }),
      ],
    }),

    tsconfigPaths(),

    visualizer({
      filename: 'bundle-analysis.html',
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
