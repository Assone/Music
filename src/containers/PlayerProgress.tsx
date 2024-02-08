import IF from '@/components/common/IF';
import Slider from '@/components/common/Slider';
import Typography from '@/components/common/Typography';
import usePlayer from '@/store/usePlayer';

const PlayerProgress: React.FC = () => {
  const currentTime = usePlayer((state) => state.currentTime);
  const duration = usePlayer((state) => state.duration);
  const data = usePlayer(
    (state) => state.context.currentTrackResourceInformation,
  );

  return (
    <div className='flex flex-col gap-2'>
      <IF condition={data !== undefined}>
        <div className='flex justify-between'>
          <Typography.Text>{currentTime}</Typography.Text>
          <Typography.Text>{duration}</Typography.Text>
        </div>
      </IF>

      <Slider value={currentTime} min={0.01} max={duration} step={0.01} />
    </div>
  );
};

export default PlayerProgress;
