import { getArtistAlbums } from '@/apis';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import Swiper from './Swiper';
import Image from './common/Image';

export interface ArtistAlbumProps {
  id: number;
}

const ArtistAlbum: React.FC<ArtistAlbumProps> = ({ id }) => {
  const query = useQuery({
    queryKey: ['artist', 'album', id],
    queryFn: () => lastValueFrom(getArtistAlbums(id)),
    initialData: [],
    select: (list) => list.filter((item) => item.isSingle === false),
  });

  return (
    <Swiper
      source={query.data}
      sourceKey='id'
      container={{
        slidesPerView: 3.5,
        spaceBetween: 10,
        slidesOffsetBefore: 10,
      }}
    >
      {({ name, id, cover }) => (
        <div key={id} className='overflow-hidden'>
          <Image src={cover} />
          <div className='truncate'>
            <Link to='/albums/$id' params={{ id: id.toString() }}>
              {name}
            </Link>
          </div>
        </div>
      )}
    </Swiper>
  );
};

export default ArtistAlbum;
