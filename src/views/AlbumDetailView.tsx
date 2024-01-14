import { TrackType } from '@/services/machine/player';
import { AlbumDetailRoute } from '@/services/routes';
import usePlayer from '@/store/usePlayer';
import { useLoaderData } from '@tanstack/react-router';
import { m } from 'framer-motion';

const AlbumDetailView: React.FC = () => {
  const { detail } = useLoaderData({ from: AlbumDetailRoute.id });
  const { play } = usePlayer();

  return (
    <m.div>
      <m.img src={detail.cover} />
      <div>{detail.name}</div>

      <div>
        <button
          type='button'
          className='rounded-md bg-blue-500 p-2 text-white'
          onClick={() => {
            play(
              detail.songs.map((item) => ({
                id: item.id,
                type: TrackType.audio,
              })),
            );
          }}
        >
          播放全部
        </button>
      </div>

      <div>
        {detail.songs.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </m.div>
  );
};

export default AlbumDetailView;
