import Image from '@/components/Image';
import { ArtistDetailRoute } from '@/services/router/map';
import { Await, useLoader } from '@tanstack/react-router';
import { Suspense } from 'react';

const ArtistDetailView: React.FC = () => {
  const { detail, mv } = useLoader({ from: ArtistDetailRoute.id });

  return (
    <div className="flex flex-col gap-2">
      <Image src={detail.cover} />
      <Typography.Title>{detail.name}</Typography.Title>
      <Suspense fallback={<div>Loading...</div>}>
        <Await promise={mv}>
          {(mvs) => {
            return (
              <div>
                <SwiperContainer
                  source={mvs}
                  sourceKey="id"
                  containerProps={{
                    slidesPerView: 3.2,
                    spaceBetween: 10,
                  }}
                >
                  {(mv) => <Image src={mv.cover} />}
                </SwiperContainer>
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
};

export default ArtistDetailView;
