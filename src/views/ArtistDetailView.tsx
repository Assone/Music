import PageTransition from '@/components/PageTransition';
import Image from '@/components/common/Image';
import { ArtistDetailRoute } from '@/services/routes';
import { Await, useLoaderData } from '@tanstack/react-router';
import { m } from 'framer-motion';

const ArtistDetailView: React.FC = () => {
  const { detail, mv } = useLoaderData({ from: ArtistDetailRoute.id });

  return (
    <PageTransition>
      <div>
        <div>{detail.name}</div>
        <Await promise={mv}>
          {(mvs) => (
            <m.ul>
              {mvs.map((mv) => (
                <m.li key={mv.id}>
                  <Image src={mv.cover} />
                  <span>{mv.name}</span>
                </m.li>
              ))}
            </m.ul>
          )}
        </Await>
      </div>
    </PageTransition>
  );
};

export default ArtistDetailView;
