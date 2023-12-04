import { LazyMotion } from 'framer-motion';
import { Suspense } from 'react';
import Player from './containers/Player';

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <main className="min-h-[calc(100vh-4rem)]">
        <Suspense>
          <Outlet />
        </Suspense>
      </main>
      <div className="sticky bottom-0 bg-black/75 backdrop-blur z-10 drop-shadow shadow-inner">
        <Player />
        <TabBar
          activeKey={location.pathname}
          items={[
            {
              key: '/',
              title: t('tabbar.home'),
              icon: <IconFluentEmojiHouse />,
            },
            {
              key: '/search',
              title: t('tabbar.search'),
              icon: <IconFluentEmojiMagnifyingGlassTiltedLeft />,
            },
            {
              key: '/settings',
              title: t('tabbar.settings'),
              icon: <IconFluentEmojiGear />,
            },
          ]}
          onChange={onRouteChange}
        />
      </div>
    </LazyMotion>
  );
};

// export default withProfiler(App);
export default App;
