import { Link, Outlet } from '@tanstack/react-router';
import { AnimatePresence, LazyMotion, m } from 'framer-motion';
import Player from './containers/Player';

const loadMotionFeatures = () =>
  import('@/services/motion').then((module) => module.default);

const App: React.FC = () => (
  <LazyMotion features={loadMotionFeatures} strict>
    <m.main className='min-h-screen'>
      <div className='flex gap-2 p-2'>
        <Link to='/' className='[&.active]:font-bold'>
          Home
        </Link>{' '}
        <Link to='/search' className='[&.active]:font-bold'>
          Search
        </Link>
        <Link to='/library' className='[&.active]:font-bold'>
          Library
        </Link>
      </div>
      <hr />

      <AnimatePresence>
        <Outlet />
      </AnimatePresence>
    </m.main>

    <Player classname='sticky bottom-0 bg-neutral-800/75 backdrop-blur' />
  </LazyMotion>
);

export default App;
