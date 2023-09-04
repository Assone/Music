import { getSearchResource } from '@/apis/resources/search';
import { cx } from '@emotion/css';
import { useQuery } from '@tanstack/react-query';
import { HTMLMotionProps } from 'framer-motion';
import { lastValueFrom } from 'rxjs';

interface SearchTrackListProps
  extends Pick<HTMLMotionProps<'ul'>, 'className'> {
  keyword?: string;
}

const SearchTrackList: React.FC<SearchTrackListProps> = ({
  className,
  keyword,
}) => {
  const { data = [] } = useQuery({
    queryKey: ['search', keyword],
    queryFn: () => lastValueFrom(getSearchResource(keyword || '')),
    enabled: !!keyword,
    select: (data) => data.songs,
  });

  return <TrackList className={cx(className)} tracks={data} cover />;
};

export default SearchTrackList;
