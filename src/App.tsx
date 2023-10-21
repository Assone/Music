import { ErrorBoundary, withProfiler } from '@sentry/react';
import {
  Outlet,
  ScrollRestoration,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { AnimatePresence, LazyMotion, m } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const route = useRouterState();
  const navigate = useNavigate();

  const onRouteChange = useCallback(
    (path: string) => {
      navigate({
        to: path as '/search',
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
        <m.main className="min-h-[calc(100vh-4rem)]">
          <AnimatePresence>
            <Outlet />
          </AnimatePresence>
        </m.main>
        <TabBar
          className="sticky bottom-0 bg-black/75 backdrop-blur z-10 drop-shadow shadow-inner"
          activeKey={route.location.pathname}
          items={[
            {
              key: '/',
              title: 'Home',
              icon: <IconFluentEmojiHouse />,
            },
            {
              key: '/search',
              title: 'Search',
              icon: <IconFluentEmojiMagnifyingGlassTiltedLeft />,
            },
            {
              key: '/settings',
              title: 'Settings',
              icon: <IconFluentEmojiGear />,
            },
          ]}
          onChange={onRouteChange}
        />

        <ScrollRestoration />

        <Toaster />
      </LazyMotion>
    </ErrorBoundary>
  );
};

export default withProfiler(App);
