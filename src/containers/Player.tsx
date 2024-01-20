import Popup from '@/components/common/Popup';
import type { ConfigurableStyle } from '@/types/props';
import classNames from 'classnames';
import { m } from 'framer-motion';
import { Suspense } from 'react';
import PlayerTrackControls from './PlayerTrackControls';
import PlayerTrackInfo from './PlayerTrackInfo';

const PlayerView = lazy(() => import('@/containers/PlayerView'));

interface PlayerProps extends Pick<ConfigurableStyle, 'className'> {}

const Player: React.FC<PlayerProps> = ({ className }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <m.div
        className={classNames(
          'flex justify-between gap-2 rounded-tl rounded-tr p-1',
          className,
        )}
        onClick={() => {
          setVisible(true);
        }}
      >
        <PlayerTrackInfo />
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
    </>
  );
};

export default Player;
