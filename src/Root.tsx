import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import App from './App';
import persister from './services/persisters';
import queryClient from './services/query/client';

const isDebug =
  import.meta.env.DEV || window.location.search.includes('debug=true');

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

    <Toaster />

    <Analytics />

    <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
  </QueryProvider>
);

export default Root;
