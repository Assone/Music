import { getSearchResource, SearchType } from '@/apis/resources/search';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { m } from 'framer-motion';
import { lastValueFrom } from 'rxjs';
import Image from './common/Image';

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
    <m.ul className='flex flex-wrap gap-2'>
      {data.map((item) => (
        <m.li
          key={item.id}
          className='flex flex-col items-center justify-center'
        >
          <Image className='h-14 w-14 rounded-full' src={item.avatar} />
          <Link to='/artists/$id' params={{ id: item.id.toString() }}>
            {item.name}
          </Link>
        </m.li>
      ))}
    </m.ul>
  );
};

export default SearchArtists;
