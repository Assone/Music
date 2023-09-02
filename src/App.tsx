import { ThemeProvider } from '@emotion/react';
import { ErrorBoundary, withProfiler } from '@sentry/react';
import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { AnimatePresence, LazyMotion, m } from 'framer-motion';

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
    <LazyMotion
      features={() => import('framer-motion').then((res) => res.domMax)}
    >
      <ThemeProvider theme={{ color: { primary: 'red' } }}>
        <m.main className="min-h-[calc(100vh-4rem)]">
          <AnimatePresence>
            <Outlet />
          </AnimatePresence>
        </m.main>
        <TabBar
          className="sticky bottom-0 h-16 shadow-lg bg-black/75 backdrop-blur z-10"
          items={[
            { key: 'Home', title: 'Home' },
            { key: 'Settings', title: 'Settings' },
          ]}
        />

        <ScrollRestoration />
      </ThemeProvider>
    </LazyMotion>
  </ErrorBoundary>
);

export default withProfiler(App);
