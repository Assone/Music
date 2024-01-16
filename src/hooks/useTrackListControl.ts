import type { TrackProps } from '@/components/Track';
import type { Duration } from 'date-fns';
import useIntersectionObserver from './common/useIntersectionObserver';
import useTracks from './useTracks';

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

export interface useTrackListControlProps {
  source?: TrackProps[];
  ids: number[];
}

export default function useTrackListControl({
  ids,
  source,
}: useTrackListControlProps) {
  const tail = useRef<HTMLDivElement>(null);

  const { query, tracks } = useTracks(ids);
  const list = useMemo(() => source || tracks, [source, tracks]);

  const isHasMore = useMemo(() => query.hasNextPage, [query.hasNextPage]);
  const isLoading = useMemo(() => query.isFetching, [query.isFetching]);
  const isLoaded = useMemo(
    () => query.isPending === false && query.hasNextPage === false,
    [query.hasNextPage, query.isPending],
  );

  const duration = useMemo(() => {
    if (query.hasNextPage) {
      return undefined;
    }

    return computeDuration(
      list.reduce((acc, cur) => acc + (cur?.duration || 0), 0),
    );
  }, [list, query.hasNextPage]);

  useDebugValue(duration, (value) => `Duration: ${value?.text}`);

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

  return {
    tail,

    list,
    duration,

    isHasMore,
    isLoading,
    isLoaded,
  };
}
