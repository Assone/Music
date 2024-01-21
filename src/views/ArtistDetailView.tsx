import ArtistAlbum from '@/components/ArtistAlbum';
import ArtistDescription from '@/components/ArtistDescription';
import ArtistMvs from '@/components/ArtistMvs';
import ArtistSingleAndEP from '@/components/ArtistSingleAndEP';
import ArtistSongs from '@/components/ArtistSongs';
import PageTransition from '@/components/PageTransition';
import Image from '@/components/common/Image';
import Typography from '@/components/common/Typography';
import { ArtistDetailRoute } from '@/services/routes';
import { useLoaderData } from '@tanstack/react-router';
import { m } from 'framer-motion';

const ArtistDetailView: React.FC = () => {
  const { detail } = useLoaderData({ from: ArtistDetailRoute.id });

  return (
    <PageTransition>
      <div className='sticky top-0'>
        <Image src={detail.cover} />
        <Typography.Title
          className='absolute bottom-2 left-2 text-white mix-blend-difference'
          level={2}
        >
          {detail.name}
        </Typography.Title>
      </div>

      <m.div className='sticky top-0 flex flex-col gap-2 bg-white'>
        <div className='flex flex-col gap-1'>
          <Typography.Title level={3}>Songs</Typography.Title>
          <ArtistSongs id={detail.id} />
        </div>

        <div className='flex flex-col gap-1'>
          <Typography.Title level={3}>MV</Typography.Title>
          <div>
            <ArtistMvs id={detail.id} />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <Typography.Title level={3}>专辑</Typography.Title>
          <div>
            <ArtistAlbum id={detail.id} />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <Typography.Title level={3}>Single & EP</Typography.Title>
          <div>
            <ArtistSingleAndEP id={detail.id} />
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <Typography.Title level={3}>Description</Typography.Title>
          <div>
            <ArtistDescription id={detail.id} />
          </div>
        </div>
      </m.div>
    </PageTransition>
  );
};

export default ArtistDetailView;
