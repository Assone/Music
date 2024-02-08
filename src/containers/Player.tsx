import IF from '@/components/common/IF';
import Popup from '@/components/common/Popup';
import useMounted from '@/hooks/common/useMounted';
import useShortcuts from '@/hooks/common/useShortcuts';
import type { ConfigurableStyle } from '@/types/props';
import classNames from 'classnames';
import { m } from 'framer-motion';
import { Suspense } from 'react';
import PlayerTrackControls from './PlayerTrackControls';
import PlayerTrackInfo from './PlayerTrackInfo';

const PlayerView = lazy(() => import('@/containers/PlayerView'));

interface PlayerProps extends Pick<ConfigurableStyle, 'className'> {}

const Player: React.FC<PlayerProps> = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useShortcuts({
    Escape: {
      callback: () => {
        setVisible(false);
      },
      while: visible,
    },
  });

  useMounted(() => {
    setMounted(true);
  });

  return (
    <IF condition={mounted}>
      <m.div
        className={classNames(
          'flex justify-between gap-2 rounded-tl rounded-tr p-1',
          className,
        )}
        onClick={() => {
          setVisible(true);
        }}
      >
        <PlayerTrackInfo className='w-3/4' />
        <PlayerTrackControls className='flex-shrink-0' />
      </m.div>

      <Popup
        className='bg-white/75 backdrop-blur'
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      >
        <Suspense>
          <PlayerView />
        </Suspense>
      </Popup>
    </IF>
  );
};

export default Player;
