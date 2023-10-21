import { getSongDetail } from '@/apis';
import { useInfiniteQuery } from '@tanstack/react-query';
import { RefObject } from 'react';
import { lastValueFrom } from 'rxjs';

export interface Track {
  id: ID;
  name: Name;
  duration?: number;
  cover?: string;
  no?: number;
  artists?: { id: ID; name: Name }[];
  album?: { id: ID; name: Name; cover?: string };
}

interface UseTracksOptions {
  lazy?: boolean;
  limit?: number;
}

export default function useTracks(
  ids: ID[],
  target: RefObject<HTMLDivElement>,
  { limit = 20 }: UseTracksOptions = {},
) {
  const query = useInfiniteQuery({
    queryKey: ['tracks', ids, limit],
    queryFn: async ({ pageParam }) => {
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
    initialPageParam: 0,
    enabled: ids.length > 0,
  });

  const tracks = useMemo(
    () => query.data?.pages.flat() ?? [],
    [query.data?.pages],
  );

  const { stop, resume } = useIntersectionObserver(
    target.current,
    ([{ isIntersecting = false } = {}]) => {
      if (isIntersecting && query.isFetching === false) {
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

  useEffect(() => {
    resume();
  }, [ids, resume]);

  return {
    ...query,
    tracks,
  };
}
