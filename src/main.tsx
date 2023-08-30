import '@/assets/main.css';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RouterProvider } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './services/i18n';
import persister from './services/persisters';
import queryClient from './services/query/client';
import router from './services/router';
import './services/sentry';

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense
      fallback={
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      }
    >
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <RouterProvider router={router} />

        <TanStackRouterDevtools router={router} />
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
      </PersistQueryClientProvider>
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
