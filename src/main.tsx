import '@/assets/main.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RouterProvider } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './services/i18n';
import persister from './services/persisters';
import queryClient from './services/query/client';
import router from './services/router';

const TanStackRouterDevtools = import.meta.env.DEV
  ? lazy(() =>
      // Lazy load in development
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
        // For Embedded Mode
        // default: res.TanStackRouterDevtoolsPanel
      })),
    )
  : () => null; // Render nothing in production

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
