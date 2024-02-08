import Button from '@/components/common/Button';
import IF from '@/components/common/IF';
import Slider from '@/components/common/Slider';
import usePlayer from '@/store/usePlayer';
import { Link } from '@tanstack/react-router';
import { m } from 'framer-motion';
import IconPause from '~icons/material-symbols/pause';
import IconPlayArrow from '~icons/material-symbols/play-arrow';
import IconSkipNext from '~icons/material-symbols/skip-next';
import IconSkipPrevious from '~icons/material-symbols/skip-previous';
// eslint-disable-next-line import/order
import PlayerTrackCover from './PlayerTrackCover';

const PlayerView: React.FC = () => {
  const isPlaying = usePlayer((state) => state.isPlaying);
  const isLoading = usePlayer((state) => state.isLoading);
  const currentTime = usePlayer((state) => state.currentTime);
  const duration = usePlayer((state) => state.duration);
  const data = usePlayer(
    (state) => state.context.currentTrackResourceInformation,
  );
  const { play, pause, nextTrack, prevTrack } = usePlayer();

  return (
    <m.div className='flex flex-col gap-6 p-8'>
      <m.div
        className='flex justify-center px-5 py-10'
        animate={{ scale: isPlaying || isLoading ? 1.4 : undefined }}
        transition={{ type: 'spring' }}
      >
        <PlayerTrackCover className='h-64 w-64 overflow-hidden rounded' />
      </m.div>
      <div className='flex flex-col gap-2'>
        {data !== undefined ? (
          <div className='flex flex-col gap-1 overflow-hidden'>
            <div className='truncate'>{data.name}</div>
            {data.artist ? (
              <Link
                to='/artists/$id'
                params={{ id: data.artist.id.toString() }}
              >
                {data.artist.name}
              </Link>
            ) : null}
          </div>
        ) : (
          <div>暂未播放</div>
        )}

        <div>
          <div>
            {currentTime} / {duration}
          </div>
          <Slider value={currentTime} min={0.01} max={duration} step={0.01} />
        </div>

        <div className='flex justify-center gap-2 text-4xl'>
          <Button onClick={prevTrack}>
            <IconSkipPrevious />
          </Button>
          <IF
            condition={isPlaying}
            fallback={
              <Button onClick={() => play()}>
                <IconPlayArrow />
              </Button>
            }
          >
            <Button onClick={() => pause()}>
              <IconPause />
            </Button>
          </IF>
          <Button onClick={nextTrack}>
            <IconSkipNext />
          </Button>
        </div>
      </div>
    </m.div>
  );
};

export default PlayerView;
