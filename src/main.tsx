import '@/assets/main.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';

import('./services/sentry');
import('./services/i18n');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
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
