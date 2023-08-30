import { ArtistDetailRoute } from '@/services/router/map';
import { Await, useLoader } from '@tanstack/react-router';
import { m } from 'framer-motion';
import { Suspense } from 'react';

const ArtistDetailView: React.FC = () => {
  const { detail } = useLoader({ from: ArtistDetailRoute.id });

  return (
    <Suspense
      fallback={
        <div>
          <Typography.Title level={2}>Loading...</Typography.Title>
        </div>
      }
    >
      <Await promise={detail}>
        {(data) => (
          <m.div>
            <Typography.Title>{data.artist.name}</Typography.Title>
          </m.div>
        )}
      </Await>
    </Suspense>
  );
};

export default ArtistDetailView;
