import { SearchType, getSearchResource } from '@/apis/resources/search';
import { cx } from '@emotion/css';
import { useQuery } from '@tanstack/react-query';
import { HTMLMotionProps } from 'framer-motion';
import { lastValueFrom } from 'rxjs';

interface SearchSongsTrackListProps
  extends Pick<HTMLMotionProps<'ul'>, 'className'> {
  keyword?: string;
}

const SearchSongsTrackList: React.FC<SearchSongsTrackListProps> = ({
  className,
  keyword,
}) => {
  const { data = [] } = useQuery({
    queryKey: ['search', keyword],
    queryFn: ({ signal }) =>
      lastValueFrom(
        getSearchResource(
          keyword || '',
          {
            type: SearchType.song,
          },
          { signal },
        ),
      ),
    enabled: !!keyword,
    select: (data) => data.songs,
  });

  return (
    <TrackList
      className={cx(className)}
      tracks={data}
      cover
      artists
      renderTrackListInfo={() => null}
    />
  );
};

export default SearchSongsTrackList;
