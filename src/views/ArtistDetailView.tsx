import ArtistAlbum from '@/components/ArtistAlbum';
import ArtistMvs from '@/components/ArtistMvs';
import ArtistSongs from '@/components/ArtistSongs';
import PageTransition from '@/components/PageTransition';
import IF from '@/components/common/IF';
import Image from '@/components/common/Image';
import Typography from '@/components/common/Typography';
import { ArtistDetailRoute } from '@/services/routes';
import { Await, useLoaderData } from '@tanstack/react-router';
import { m } from 'framer-motion';

const ArtistDetailView: React.FC = () => {
  const { detail, mv } = useLoaderData({ from: ArtistDetailRoute.id });

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

        <Await promise={mv}>
          {(mvs) => (
            <IF condition={mvs.length > 0}>
              <div className='flex flex-col gap-1'>
                <Typography.Title level={3}>MV</Typography.Title>
                <div>
                  <ArtistMvs id={detail.id} />
                </div>
              </div>
            </IF>
          )}
        </Await>

        <div className='flex flex-col gap-1'>
          <Typography.Title level={3}>专辑</Typography.Title>
          <div>
            <ArtistAlbum id={detail.id} />
          </div>
        </div>
      </m.div>
    </PageTransition>
  );
};

export default ArtistDetailView;
