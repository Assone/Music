import useIntersectionObserver from '@/hooks/common/useIntersectionObserver';
import useTracks from '@/hooks/useTracks';
import type { Duration } from 'date-fns';
import { m } from 'framer-motion';
import type { TrackProps } from './Track';
import Track from './Track';
import IF from './common/IF';

interface ComputeDurationOptions {
  format: 'HH:mm:ss' | 'HH:mm' | 'mm:ss';
}

const computeDuration = (
  milliseconds: number,
  options: ComputeDurationOptions = { format: 'HH:mm' },
) => {
  const format: (keyof Duration)[] = [];

  if (options.format.includes('HH')) {
    format.push('hours');
  }

  if (options.format.includes('mm')) {
    format.push('minutes');
  }

  if (options.format.includes('ss')) {
    format.push('seconds');
  }

  const duration = intervalToDuration({ start: 0, end: milliseconds });
  const text = formatDuration(duration, { format });

  return {
    ...duration,
    text,
  };
};

export interface TrackListProps {
  source?: TrackProps[];
  ids?: number[];
  index?: boolean;
  duration?: boolean;
  renderDurationInfo?: (
    values?: Duration & { text: string },
  ) => React.ReactNode;
}

const TrackList: React.FC<TrackListProps> = ({
  ids = [],
  source,
  index: showIndex,
  duration: showDuration,
  renderDurationInfo,
}) => {
  const tail = useRef<HTMLDivElement>(null);

  const { query, tracks } = useTracks(ids);
  const list = useMemo(() => source || tracks, [source, tracks]);
  const durationInfo = useMemo(() => {
    if (query.hasNextPage) {
      return undefined;
    }

    return computeDuration(
      list.reduce((acc, cur) => acc + (cur?.duration || 0), 0),
    );
  }, [list, query.hasNextPage]);

  const onLoadMore = () => {
    query.fetchNextPage().catch((error) => {
      console.debug('[TrackList] fetchNextPage error:', error);
    });
  };

  const { stop } = useIntersectionObserver(tail.current, (entries) => {
    entries.forEach((entry) => {
      if (
        entry.isIntersecting &&
        query.hasNextPage &&
        query.isFetching === false
      ) {
        onLoadMore();
      }

      if (query.isPending === false && query.hasNextPage === false) {
        stop();
      }
    });
  });

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

      <IF condition={query.isFetching}>
        <div>Loading...</div>
      </IF>

      <div ref={tail} />

      <IF condition={query.hasNextPage === false}>
        {renderDurationInfo?.(durationInfo)}
      </IF>
    </m.ul>
  );
};

export default TrackList;
