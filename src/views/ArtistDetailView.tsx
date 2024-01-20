import ArtistAlbum from '@/components/ArtistAlbum';
import ArtistMvs from '@/components/ArtistMvs';
import ArtistSongs from '@/components/ArtistSongs';
import PageTransition from '@/components/PageTransition';
import Image from '@/components/common/Image';
import Typography from '@/components/common/Typography';
import { ArtistDetailRoute } from '@/services/routes';
import { useLoaderData } from '@tanstack/react-router';

const ArtistDetailView: React.FC = () => {
  const { detail } = useLoaderData({ from: ArtistDetailRoute.id });

  return (
    <PageTransition>
      <div className='flex flex-col gap-2'>
        <Image className='sticky top-0' src={detail.cover} />

        <Typography.Title level={2}>{detail.name}</Typography.Title>

        <ArtistSongs id={detail.id} />

        <div className='flex flex-col gap-1'>
          <Typography.Title level={3}>MV</Typography.Title>
          <div>
            <ArtistMvs id={detail.id} />
          </div>
          A
        </div>

        <div className='flex flex-col gap-1'>
          <Typography.Title level={3}>专辑</Typography.Title>
          <div>
            <ArtistAlbum id={detail.id} />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ArtistDetailView;
