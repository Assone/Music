import type { ConfigurableStyle } from '@/types/props';
import classNames from 'classnames';
import { m } from 'framer-motion';
import PlayerTrackControls from './PlayerTrackControls';
import PlayerTrackInfo from './PlayerTrackInfo';

interface PlayerProps extends Pick<ConfigurableStyle, 'classname'> {}

const Player: React.FC<PlayerProps> = ({ classname }) => (
  <m.div
    className={classNames(
      'flex justify-between gap-2 rounded-tl rounded-tr p-1',
      classname,
    )}
  >
    <PlayerTrackInfo />
    <PlayerTrackControls classname='flex-shrink-0' />
  </m.div>
);

export default Player;
