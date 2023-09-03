import { ThemeProvider } from '@emotion/react';
import { ErrorBoundary, withProfiler } from '@sentry/react';
import {
  Outlet,
  ScrollRestoration,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { AnimatePresence, LazyMotion, m } from 'framer-motion';

declare module '@emotion/react' {
  export interface Theme {
    color: {
      primary: string;
      secondary: string;
      // positive: string;
      // negative: string;
    };
  }
}

const App: React.FC = () => {
  const route = useRouterState();
  const navigate = useNavigate();

  const onRouteChange = useCallback(
    (path: string) => {
      navigate({
        to: path,
      }).catch((err) => {
        console.error('%c[Error]: router navigate', 'color: red; ', err);
      });
    },
    [navigate],
  );

  return (
    <ErrorBoundary fallback={<p>An error has occurred</p>}>
      <LazyMotion
        features={() => import('framer-motion').then((res) => res.domMax)}
      >
        <ThemeProvider
          theme={{ color: { primary: '#00b578', secondary: '#666' } }}
        >
          <m.main className="min-h-[calc(100vh-4rem)]">
            <AnimatePresence>
              <Outlet />
            </AnimatePresence>
          </m.main>
          <TabBar
            className="sticky bottom-0 shadow-lg bg-black/75 backdrop-blur z-10"
            activeKey={route.location.pathname}
            items={[
              { key: '/', title: 'Home' },
              { key: '/settings', title: 'Settings' },
            ]}
            onChange={onRouteChange}
          />
          <ScrollRestoration />
        </ThemeProvider>
      </LazyMotion>
    </ErrorBoundary>
  );
};

export default withProfiler(App);
