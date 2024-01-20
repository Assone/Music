import { getArtistMvs } from '@/apis';
import Image from '@/components/common/Image';
import { useQuery } from '@tanstack/react-query';
import Swiper from './Swiper';
import Typography from './common/Typography';

export interface ArtistMvsProps {
  id: number;
}

const ArtistMvs: React.FC<ArtistMvsProps> = ({ id }) => {
  const query = useQuery({
    queryKey: ['artists', 'mv', id],
    queryFn: () => lastValueFrom(getArtistMvs(id)),
    initialData: [],
  });

  return (
    <Swiper
      source={query.data}
      sourceKey='id'
      container={{
        slidesPerView: 2.2,
        spaceBetween: 10,
        slidesOffsetBefore: 10,
      }}
    >
      {({ cover, name }) => (
        <div className='overflow-hidden'>
          <Image className='overflow-hidden rounded' src={cover} />
          <div className='truncate'>
            <Typography.Text>{name}</Typography.Text>
          </div>
        </div>
      )}
    </Swiper>
  );
};

export default ArtistMvs;
