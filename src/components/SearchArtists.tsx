import { getSearchResource, SearchType } from '@/apis/resources/search';
import { useQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import { lastValueFrom } from 'rxjs';

export interface SearchArtistsProps {
  keyword?: string;
}

const SearchArtists: React.FC<SearchArtistsProps> = ({ keyword }) => {
  const { data = [] } = useQuery({
    queryKey: ['search', 'artist', keyword],
    queryFn: ({ signal }) =>
      lastValueFrom(
        getSearchResource(keyword!, { type: SearchType.artist }, { signal }),
      ),
    enabled: keyword !== undefined,
    select: (data) => data.artists,
  });

  return (
    <m.ul>
      {data.map((item) => (
        <m.li key={item.id}>{item.name}</m.li>
      ))}
    </m.ul>
  );
};

export default SearchArtists;
