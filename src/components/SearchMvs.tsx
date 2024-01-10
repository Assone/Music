import { getSearchResource, SearchType } from '@/apis/resources/search';
import { useQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import { lastValueFrom } from 'rxjs';

export interface SearchMvsProps {
  keyword?: string;
}

const SearchMvs: React.FC<SearchMvsProps> = ({ keyword }) => {
  const { data = [] } = useQuery({
    queryKey: ['search', 'mvs', keyword],
    queryFn: ({ signal }) =>
      lastValueFrom(
        getSearchResource(keyword!, { type: SearchType.mv }, { signal }),
      ),
    enabled: keyword !== undefined,
    select: (data) => data.songs,
  });

  return (
    <m.ul>
      {data.map((item) => (
        <m.li key={item.id}>{item.name}</m.li>
      ))}
    </m.ul>
  );
};

export default SearchMvs;
