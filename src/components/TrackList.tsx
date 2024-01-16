import useTrackListControl from '@/hooks/useTrackListControl';
import type { Duration } from 'date-fns';
import { m } from 'framer-motion';
import type { TrackProps } from './Track';
import Track from './Track';
import IF from './common/IF';

export interface TrackListProps {
  source?: TrackProps[];
  ids?: number[];
  index?: boolean;
  duration?: boolean;

  renderDurationInfo?: (values: {
    duration: Duration & { text: string };
    count: number;
  }) => React.ReactNode;

  onLoaded?: () => void;
}

const TrackList: React.FC<TrackListProps> = ({
  ids = [],
  source,
  index: showIndex,
  duration: showDuration,

  renderDurationInfo,

  onLoaded,
}) => {
  const { tail, list, duration, isLoading, isLoaded } = useTrackListControl({
    ids,
    source,
  });

  useEffect(() => {
    if (isLoaded) {
      onLoaded?.();
    }
  }, [isLoaded, onLoaded]);

  return (
    <m.ul className='flex flex-col gap-1'>
      {list.map(({ id, name, cover, artists, duration }, index) => (
        <Track
          id={id}
          name={name}
          cover={cover}
          artists={artists}
          index={showIndex ? index + 1 : undefined}
          duration={showDuration ? duration : undefined}
          key={id}
        />
      ))}

      <IF condition={isLoading}>
        <div>Loading...</div>
      </IF>

      <div ref={tail} />

      <IF condition={isLoaded}>
        {renderDurationInfo?.({ duration: duration!, count: list.length })}
      </IF>
    </m.ul>
  );
};

export default TrackList;
