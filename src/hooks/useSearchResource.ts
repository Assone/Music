import {
  SearchType,
  getSearchHotList,
  getSearchResource,
} from "@/apis/resources/search";
import { useQuery } from "@tanstack/react-query";
import { lastValueFrom } from "rxjs";

export interface useSearchResourceProps {
  keyword?: string | undefined;
}

export default function useSearchResource({ keyword }: useSearchResourceProps) {
  const hotListQuery = useQuery({
    queryKey: ["search", "hot"],
    queryFn: () => lastValueFrom(getSearchHotList()),
    initialData: [],
  });
  const artistsQuery = useQuery({
    queryKey: ["search", "artist", keyword],
    queryFn: () =>
      lastValueFrom(getSearchResource(keyword!, { type: SearchType.artist })),
    enabled: keyword !== undefined,
    select: (data) => data.artists,
  });
  const songsQuery = useQuery({
    queryKey: ["search", "songs", keyword],
    queryFn: () =>
      lastValueFrom(getSearchResource(keyword!, { type: SearchType.song })),
    enabled: keyword !== undefined,
    select: (data) => data.songs,
  });

  return { hotListQuery, artistsQuery, songsQuery };
}
