import { TrackType } from '@/services/machine/player';
import { PlaylistDetailRoute } from '@/services/routes';
import usePlayer from '@/store/usePlayer';
import { useLoaderData } from '@tanstack/react-router';
import { m } from 'framer-motion';

const PlaylistDetailView: React.FC = () => {
  const { detail } = useLoaderData({ from: PlaylistDetailRoute.id });
  const play = usePlayer((state) => state.play);

  return (
    <m.div>
      <h1>{detail.name}</h1>
      <p>{detail.description}</p>

      <button
        type='button'
        onClick={() => {
          play(
            detail.trackIds.map((item) => ({
              id: item,
              type: TrackType.audio,
            })),
          );
        }}
        className='rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700'
      >
        Play
      </button>
    </m.div>
  );
};

export default PlaylistDetailView;
