import { HydrationBoundary, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { I18nextProvider } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import App from './App';
import i18n from './services/i18n';
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

const Analytics = lazy(() =>
  import('@vercel/analytics/react').then((d) => ({ default: d.Analytics })),
);

// const QueryProvider = import.meta.env.DEV
//   ? QueryClientProvider
//   : PersistQueryClientProvider;

const Root: React.FC = () => {
  const data = useLoaderData() as { clientState: unknown };

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={data.clientState}>
          <ThemeProvider>
            <PlayerProvider>
              <App />
            </PlayerProvider>
          </ThemeProvider>

          <Toaster />

          <Analytics />

          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="top-right"
          />
        </HydrationBoundary>
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default Root;
