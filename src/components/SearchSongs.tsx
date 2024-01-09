import { getSearchResource, SearchType } from '@/apis/resources/search';
import { useQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import { lastValueFrom } from 'rxjs';

export interface SearchSongsProps {
  keyword?: string;
}

const SearchSongs: React.FC<SearchSongsProps> = ({ keyword }) => {
  const { data = [] } = useQuery({
    queryKey: ['search', 'songs', keyword],
    queryFn: ({ signal }) =>
      lastValueFrom(
        getSearchResource(keyword!, { type: SearchType.song }, { signal }),
      ),
    enabled: keyword !== undefined,
    select: (data) => data.songs,
  });

  return (
    <m.ul>
      {data.map((item) => (
        <m.li>{item.name}</m.li>
      ))}
    </m.ul>
  );
};

export default SearchSongs;
