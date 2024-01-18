import Popup from '@/components/common/Popup';
import type { ConfigurableStyle } from '@/types/props';
import classNames from 'classnames';
import { m } from 'framer-motion';
import PlayerTrackControls from './PlayerTrackControls';
import PlayerTrackCover from './PlayerTrackCover';
import PlayerTrackInfo from './PlayerTrackInfo';

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
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
      >
        <PlayerTrackCover />
      </Popup>
    </>
  );
};

export default Player;
