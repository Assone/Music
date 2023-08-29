import { Outlet } from '@tanstack/react-router';
import { AnimatePresence, LazyMotion, domMax, m } from 'framer-motion';

const App = () => (
  <LazyMotion features={domMax}>
    <m.main className="min-h-screen">
      <AnimatePresence>
        <Outlet />
      </AnimatePresence>
    </m.main>
  </LazyMotion>
);

export default App;
