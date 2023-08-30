import { ArtistDetailRoute } from '@/services/router/map';
import { Await, useLoader } from '@tanstack/react-router';
import { Suspense } from 'react';

const ArtistDetailView: React.FC = () => {
  const { detail } = useLoader({ from: ArtistDetailRoute.id });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await promise={detail}>{(data) => <div>{data.name}</div>}</Await>
    </Suspense>
  );
};

export default ArtistDetailView;
