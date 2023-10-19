import classnames from 'classnames';
import { m } from 'framer-motion';

interface PlayButtonProps {
  onPlay?: VoidFunction;
}

const PlayButton: React.FC<PlayButtonProps> = ({ onPlay }) => (
  <m.button
    className={classnames([
      'dark:text-white w-full rounded-xl bg-green-500 p-2 select-none transition-all',
    ])}
    onClick={onPlay}
    whileTap={{ opacity: 0.8 }}
    transition={{ duration: 0.6 }}
  >
    播放
  </m.button>
);

export default PlayButton;
