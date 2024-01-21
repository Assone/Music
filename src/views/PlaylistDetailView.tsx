import PageTransition from '@/components/PageTransition';
import SimilarPlaylist from '@/components/SimilarPlaylist';
import TrackList from '@/components/TrackList';
import Button from '@/components/common/Button';
import Image from '@/components/common/Image';
import { TrackType } from '@/services/machine/player';
import { PlaylistDetailRoute } from '@/services/routes';
import usePlayer from '@/store/usePlayer';
import { useLoaderData } from '@tanstack/react-router';
import { m } from 'framer-motion';

const PlaylistDetailView: React.FC = () => {
  const { detail } = useLoaderData({ from: PlaylistDetailRoute.id });
  const play = usePlayer((state) => state.play);

  const onPlay = () => {
    play(
      detail.trackIds.map((item) => ({
        id: item,
        type: TrackType.audio,
      })),
    );
  };

  return (
    <PageTransition>
      <m.div>
        <Image src={detail.cover} />
        <div>
          <h1 className='text-center text-xl font-bold'>{detail.name}</h1>
          <p
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: detail.description.replace(/\n/g, '<br />'),
            }}
          />
        </div>

        <Button
          onClick={onPlay}
          className='rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700'
        >
          Play
        </Button>

        <TrackList ids={detail.trackIds} />

        <SimilarPlaylist id={detail.id} />
      </m.div>
    </PageTransition>
  );
};

export default PlaylistDetailView;
