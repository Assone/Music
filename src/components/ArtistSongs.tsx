import { getArtistSongs } from '@/apis';
import { useQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import Swiper from './Swiper';
import Track from './Track';

export interface ArtistSongsProps {
  id: number;
}

const ArtistSongs: React.FC<ArtistSongsProps> = ({ id }) => {
  const query = useQuery({
    queryKey: ['artist', 'songs', id],
    queryFn: () => lastValueFrom(getArtistSongs(id)),
    initialData: [],
  });
  const data = useMemo(() => {
    const list = [];

    for (let i = 0; i < query.data.length; i += 3) {
      list.push(query.data.slice(i, i + 3));
    }

    return list;
  }, [query.data]);

  return (
    <m.div>
      <Swiper
        source={data}
        container={{
          slidesPerView: 1.1,
          spaceBetween: 10,
          slidesOffsetBefore: 10,
        }}
      >
        {(list) => (
          <div>
            {list.map(({ id, name, cover }) => (
              <Track id={id} name={name} cover={cover} key={id} />
            ))}
          </div>
        )}
      </Swiper>
    </m.div>
  );
};

export default ArtistSongs;
