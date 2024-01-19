import Button from '@/components/common/Button';
import IF from '@/components/common/IF';
import { useMediaQuery } from '@/hooks/common/useMediaQuery';
import usePlayer from '@/store/usePlayer';
import type { ConfigurableStyle } from '@/types/props';
import classNames from 'classnames';
import { m } from 'framer-motion';
import IconPause from '~icons/material-symbols/pause';
import IconPlayArrow from '~icons/material-symbols/play-arrow';
import IconSkipNext from '~icons/material-symbols/skip-next';
import IconSkipPrevious from '~icons/material-symbols/skip-previous';
import IconStop from '~icons/material-symbols/stop';

interface PlayerTrackControlsProps
  extends Pick<ConfigurableStyle, 'className'> {}

const PlayerTrackControls: React.FC<PlayerTrackControlsProps> = ({
  className,
}) => {
  const { play, pause, stop, nextTrack, prevTrack } = usePlayer();
  const playing = usePlayer((state) => state.playing);
  const isMobile = useMediaQuery({ query: '(max-width: 639px)' });

  return (
    <m.div className={classNames('flex gap-2 text-2xl', className)}>
      <IF
        condition={playing}
        fallback={
          <Button
            stopPropagation={['onClick']}
            onClick={() => {
              play();
            }}
          >
            <IconPlayArrow />
          </Button>
        }
      >
        <Button
          stopPropagation={['onClick']}
          onClick={() => {
            pause();
          }}
        >
          <IconPause />
        </Button>
      </IF>

      <IF condition={isMobile === false}>
        <Button stopPropagation={['onClick']} onClick={stop}>
          <IconStop />
        </Button>
      </IF>

      <IF condition={isMobile === false}>
        <Button stopPropagation={['onClick']} onClick={prevTrack}>
          <IconSkipPrevious />
        </Button>
      </IF>

      <Button stopPropagation={['onClick']} onClick={nextTrack}>
        <IconSkipNext />
      </Button>
    </m.div>
  );
};

export default PlayerTrackControls;
