import { getSongDetail } from '@/apis';
import { useInfiniteQuery } from '@tanstack/react-query';

interface UseTracksOptions {
  limit?: number;
}

export default function useTracks(
  ids: ID[],
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

  useDebugValue(ids, (ids) => `Ids Length: ${ids.length}`);
  useDebugValue(tracks, (tracks) => `Tracks Length: ${tracks.length}`);

  return {
    query,
    tracks,
  };
}
