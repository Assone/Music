import {
  SearchType,
  getSearchHotList,
  getSearchResource,
} from "@/apis/resources/search";
import queryClient from "@/services/query-client";
import { useQuery } from "@tanstack/react-query";
import { lastValueFrom } from "rxjs";
import useAsyncEffect from "./common/useAsyncEffect";
import usePrevious from "./common/usePrevious";

export interface useSearchResourceProps {
  keyword?: string | undefined;
}

export default function useSearchResource({ keyword }: useSearchResourceProps) {
  const prevKeyword = usePrevious(keyword);

  const hotListQuery = useQuery({
    queryKey: ["search", "hot"],
    queryFn: () => lastValueFrom(getSearchHotList()),
    initialData: [],
  });
  const artistsQuery = useQuery({
    queryKey: ["search", "artist", keyword],
    queryFn: ({ signal }) =>
      lastValueFrom(
        getSearchResource(keyword!, { type: SearchType.artist }, { signal }),
      ),
    enabled: keyword !== undefined,
    select: (data) => data.artists,
  });
  const songsQuery = useQuery({
    queryKey: ["search", "songs", keyword],
    queryFn: ({ signal }) =>
      lastValueFrom(
        getSearchResource(keyword!, { type: SearchType.song }, { signal }),
      ),
    enabled: keyword !== undefined,
    select: (data) => data.songs,
  });

  useAsyncEffect(async () => {
    if (keyword !== prevKeyword) {
      await queryClient.cancelQueries({ queryKey: ["search"] });
    }
  }, [keyword, prevKeyword]);

  return { hotListQuery, artistsQuery, songsQuery };
}
