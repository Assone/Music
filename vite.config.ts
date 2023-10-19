import { sentryVitePlugin } from '@sentry/vite-plugin';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';
import million from 'million/compiler';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import { UserConfig, defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { VitePWA } from 'vite-plugin-pwa';
import { qrcode } from 'vite-plugin-qrcode';
import tsconfigPaths from 'vite-tsconfig-paths';

const { SENTRY_AUTH_TOKEN, SENTRY_DSN, SENTRY_ORG, SENTRY_PROJECT, CI } =
  process.env;

// https://vitejs.dev/config/
export default defineConfig(() => {
  const config: UserConfig = {
    define: {
      __SENTRY_DSN__: JSON.stringify(SENTRY_DSN),
      __SENTRY_DEBUG__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    },
    plugins: [
      million.vite({ auto: true }),
      react(),

      AutoImport({
        dts: true,
        imports: ['react', 'react-i18next'],
        dirs: ['src/components/**', 'src/hooks'],
        eslintrc: {
          enabled: true,
        },
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
            extension: 'jsx',
            alias: {
              fluent: 'fluent-emoji',
            },
          }),
        ],
      }),
      Icons({ compiler: 'jsx', jsx: 'react' }),

      tsconfigPaths(),
      qrcode(),

      legacy(),
      compression(),
      compression({
        algorithm: 'brotliCompress',
        exclude: [/\.(br)$/, /\.(gz)$/],
      }),
      ViteImageOptimizer(),

      VitePWA({
        srcDir: 'src',
        filename: 'sw.ts',
        strategies: 'injectManifest',
        registerType: 'autoUpdate',
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
      }),

      CI &&
        sentryVitePlugin({
          org: SENTRY_ORG,
          project: SENTRY_PROJECT,
          authToken: SENTRY_AUTH_TOKEN,
        }),

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
    build: {
      sourcemap: true,
      cssMinify: 'lightningcss',
    },
  };

  return config;
});
