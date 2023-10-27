import '@/assets/main.css';
import { RouterProvider } from '@tanstack/react-router';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import router from './services/router';

import('./services/sentry');
import('./services/i18n');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading....</div>}>
      <RouterProvider router={router} />
    </Suspense>
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
