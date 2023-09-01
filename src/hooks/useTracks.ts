import { getSongDetail } from '@/apis';
import { useInfiniteQuery } from '@tanstack/react-query';
import { RefObject } from 'react';
import { lastValueFrom } from 'rxjs';

export interface Track {
  id: ID;
  name: Name;
  duration: number;
  no?: number;
}

interface UseTracksOptions {
  lazy?: boolean;
  limit?: number;
}

export default function useTracks(
  ids: ID[],
  target: RefObject<HTMLDivElement>,
  { limit = 50 }: UseTracksOptions = {},
) {
  const query = useInfiniteQuery({
    queryKey: ['tracks', ids, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const start = pageParam * limit;
      const end = start + limit;
      const list = ids.slice(start, end);

      return list.length ? lastValueFrom(getSongDetail(list)) : [];
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < limit) {
        return undefined;
      }

      return pages.length;
    },
  });

  const tracks = useMemo(
    () => query.data?.pages.flat() ?? [],
    [query.data?.pages],
  );

  const { stop } = useIntersectionObserver(
    target.current,
    ([{ isIntersecting = false } = {}]) => {
      if (isIntersecting && !query.isFetching) {
        if (query.hasNextPage) {
          query.fetchNextPage().catch((error) => {
            console.error('%c[Error useTracks]', 'color: #f00;', error);
          });
        } else {
          stop();
        }
      }
    },
  );

  return {
    ...query,
    tracks,
  };
}
