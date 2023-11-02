import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { useLoaderData } from 'react-router-dom';
import App from './App';
import queryClient from './services/query/client';

const isDebug =
  import.meta.env.DEV ||
  globalThis?.window?.location.search.includes('debug=true');

const ReactQueryDevtools = isDebug
  ? lazy(() =>
      import('@tanstack/react-query-devtools/production').then((d) => ({
        default: d.ReactQueryDevtools,
      })),
    )
  : () => null;

// const QueryProvider = import.meta.env.DEV
//   ? QueryClientProvider
//   : PersistQueryClientProvider;

const Root: React.FC = () => {
  const data = useLoaderData() as { clientState: unknown };

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={data.clientState}>
        <App />

        <Toaster />

        <Analytics />

        <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-right" />
      </HydrationBoundary>
    </QueryClientProvider>
  );
};

export default Root;
