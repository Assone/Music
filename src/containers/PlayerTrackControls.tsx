import IF from '@/components/common/IF';
import usePlayer from '@/store/usePlayer';
import type { ConfigurableStyle } from '@/types/props';
import classNames from 'classnames';
import { m } from 'framer-motion';

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
          <button type='button' onClick={() => play()}>
            Play
          </button>
        }
      >
        <button type='button' onClick={pause}>
          Pause
        </button>
      </IF>

      <button type='button' onClick={stop}>
        Stop
      </button>
      <button type='button' onClick={nextTrack}>
        Next
      </button>
      <button type='button' onClick={prevTrack}>
        Prev
      </button>
    </m.div>
  );
};

export default PlayerTrackControls;
