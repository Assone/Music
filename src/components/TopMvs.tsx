import { getTopMvs } from '@/apis/resources/top';
import { useQuery } from '@tanstack/react-query';
import Swiper from './Swiper';
import Image from './common/Image';
import Typography from './common/Typography';

const TopMvs: React.FC = () => {
  const query = useQuery({
    queryKey: ['top', 'mv'],
    queryFn: () => lastValueFrom(getTopMvs({ limit: 10 })),
    initialData: [],
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
      {({ name, cover }) => (
        <div>
          <Image className='overflow-hidden rounded' src={cover} />
          <div className='truncate'>
            <Typography.Text>{name}</Typography.Text>
          </div>
        </div>
      )}
    </Swiper>
  );
};

export default TopMvs;
