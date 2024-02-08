import '@/assets/main.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import { StartClient } from '@tanstack/react-router-server/client';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter } from './router';

const router = createRouter();
router.hydrate().catch((error) => {
  console.error('[Router Hydrate Error]', error);
});

const container = import.meta.env.SSR
  ? document
  : document.getElementById('root')!;

if (import.meta.env.DEV) {
  // eslint-disable-next-line import/no-extraneous-dependencies, no-void
  void import('eruda').then(({ default: eruda }) => {
    eruda.init();
  });
}

ReactDOM.hydrateRoot(
  container,
  <React.StrictMode>
    <StartClient router={router} />
  </React.StrictMode>,
);
