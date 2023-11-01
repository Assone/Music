import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  RouterProvider,
  createBrowserRouter,
  matchRoutes,
} from 'react-router-dom';
import routes from './routes';

import '@/assets/main.css';

import('./services/sentry');
import('./services/i18n');

if (
  import.meta.env.DEV ||
  (import.meta.env.PROD && window.location.search.includes('debug=true'))
) {
  import('eruda')
    .then(({ default: eruda }) => eruda.init())
    .catch(() => console.error('%c[Error] Failed to load eruda', 'color:red'));
}

async function hydrate() {
  // Determine if any of the initial routes are lazy
  const lazyMatches = matchRoutes(routes, window.location)?.filter(
    (m) => m.route.lazy,
  );

  // Load the lazy matches and update the routes before creating your router
  // so we can hydrate the SSR-rendered content synchronously
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async (m) => {
        const routeModule = await m.route.lazy!();
        Object.assign(m.route, { ...routeModule, lazy: undefined });
      }),
    );
  }

  const router = createBrowserRouter(routes);

  ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}

hydrate().catch((err) => {
  console.error(err);
});