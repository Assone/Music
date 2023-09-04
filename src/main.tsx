import '@/assets/main.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RouterProvider } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import persister from './services/persisters';
import queryClient from './services/query/client';
import router from './services/router';

import('./services/sentry');
import('./services/i18n');

const isDebug =
  import.meta.env.DEV || window.location.search.includes('debug=true');

const TanStackRouterDevtools = isDebug
  ? lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    )
  : () => null; // Render nothing in production

const ReactQueryDevtools = isDebug
  ? lazy(() =>
      import('@tanstack/react-query-devtools/production').then((d) => ({
        default: d.ReactQueryDevtools,
      })),
    )
  : () => null;

const QueryProvider = import.meta.env.DEV
  ? QueryClientProvider
  : PersistQueryClientProvider;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense fallback={<p>Loading...</p>}>
      <QueryProvider client={queryClient} persistOptions={{ persister }}>
        <RouterProvider router={router} />

        <TanStackRouterDevtools
          router={router}
          toggleButtonProps={{
            style: {
              position: 'fixed',
              top: 16,
              right: 70,
              bottom: 'atuo',
              left: 'auto',
            },
          }}
        />
        <ReactQueryDevtools
          initialIsOpen={false}
          toggleButtonProps={{
            style: {
              position: 'fixed',
              top: 10,
              right: 10,
              bottom: 'atuo',
              left: 'auto',
            },
          }}
        />

        <Analytics />
      </QueryProvider>
    </React.Suspense>
  </React.StrictMode>,
);

if (
  import.meta.env.DEV ||
  (import.meta.env.PROD && window.location.search.includes('debug=true'))
) {
  import('eruda')
    .then(({ default: eruda }) => eruda.init())
    .catch(() => console.error('%c[Error] Failed to load eruda', 'color:red'));
}
