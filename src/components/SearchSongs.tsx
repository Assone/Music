import { getSearchResource, SearchType } from '@/apis/resources/search';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
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
        <m.li key={item.id} className='flex gap-2'>
          <m.img className='h-10 w-10' src={item.cover} />

          <div className='flex flex-col overflow-hidden'>
            <m.span className='truncate'>{item.name}</m.span>
            <div>
              {item.artists.map((artist) => (
                <Link
                  to='/artists/$id'
                  params={{ id: artist.id.toString() }}
                  key={artist.id}
                >
                  {artist.name}
                </Link>
              ))}
            </div>
          </div>
        </m.li>
      ))}
    </m.ul>
  );
};

export default SearchSongs;
