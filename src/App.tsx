import { withProfiler } from '@sentry/react';
import { AnimatePresence, LazyMotion, m } from 'framer-motion';
import { Suspense } from 'react';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onRouteChange = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  return (
    <LazyMotion
      features={() => import('framer-motion').then((res) => res.domMax)}
    >
      <m.main className="min-h-[calc(100vh-4rem)]">
        <AnimatePresence>
          <Suspense>
            <Outlet />
          </Suspense>
        </AnimatePresence>
      </m.main>
      <TabBar
        className="sticky bottom-0 bg-black/75 backdrop-blur z-10 drop-shadow shadow-inner"
        activeKey={location.pathname}
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
    </LazyMotion>
  );
};

export default withProfiler(App);
