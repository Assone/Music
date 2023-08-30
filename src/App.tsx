import { ThemeProvider } from '@emotion/react';
import { ErrorBoundary, withProfiler } from '@sentry/react';
import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { AnimatePresence, LazyMotion, domMax, m } from 'framer-motion';

declare module '@emotion/react' {
  export interface Theme {
    color: {
      primary: string;
      // positive: string;
      // negative: string;
    };
  }
}

const App = () => (
  <ErrorBoundary fallback={<p>An error has occurred</p>}>
    <LazyMotion features={domMax}>
      <ThemeProvider theme={{ color: { primary: 'red' } }}>
        <m.main className="min-h-screen">
          <AnimatePresence>
            <Outlet />
          </AnimatePresence>
          <ScrollRestoration />
        </m.main>
      </ThemeProvider>
    </LazyMotion>
  </ErrorBoundary>
);

export default withProfiler(App);
