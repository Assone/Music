import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ScrollRestoration } from '@tanstack/react-router';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import App from './App';
import persister from './services/persisters';
import queryClient from './services/query/client';
import router from './services/router';

const isDebug =
  import.meta.env.DEV || window.location.search.includes('debug=true');

const TanStackRouterDevtools = isDebug
  ? lazy(() =>
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
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

const Root: React.FC = () => (
  <QueryProvider client={queryClient} persistOptions={{ persister }}>
    <App />

    <ScrollRestoration />

    <Toaster />

    <Analytics />

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
    <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
  </QueryProvider>
);

export default Root;
