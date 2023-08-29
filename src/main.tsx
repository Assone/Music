import '@/assets/main.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './services/i18n';
import persister from './services/persisters';
import queryClient from './services/query/client';
import router from './services/router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <RouterProvider router={router} />
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
      {/* </QueryClientProvider> */}
    </PersistQueryClientProvider>
  </React.StrictMode>,
);
