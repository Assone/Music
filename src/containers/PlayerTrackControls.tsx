import Button from '@/components/common/Button';
import IF from '@/components/common/IF';
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
  extends Pick<ConfigurableStyle, 'classname'> {}

const PlayerTrackControls: React.FC<PlayerTrackControlsProps> = ({
  classname,
}) => {
  const { play, pause, stop, nextTrack, prevTrack } = usePlayer();
  const playing = usePlayer((state) => state.playing);

  return (
    <m.div className={classNames('flex gap-2', classname)}>
      <IF
        condition={playing}
        fallback={
          <Button onClick={() => play()}>
            <IconPlayArrow />
          </Button>
        }
      >
        <Button onClick={pause}>
          <IconPause />
        </Button>
      </IF>

      <Button onClick={stop}>
        <IconStop />
      </Button>

      <Button onClick={nextTrack}>
        <IconSkipNext />
      </Button>

      <Button onClick={prevTrack}>
        <IconSkipPrevious />
      </Button>
    </m.div>
  );
};

export default PlayerTrackControls;
