import PageTransition from '@/components/PageTransition';
import TrackList from '@/components/TrackList';
import Button from '@/components/common/Button';
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
        <m.img src={detail.cover} />
        <h1>{detail.name}</h1>
        <p
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: detail.description.replace(/\n/g, '<br />'),
          }}
        />

        <Button
          onClick={onPlay}
          className='rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700'
        >
          Play
        </Button>

        <TrackList ids={detail.trackIds} />
      </m.div>
    </PageTransition>
  );
};

export default PlaylistDetailView;
