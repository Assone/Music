import PageTransition from '@/components/PageTransition';
import Button from '@/components/common/Button';
import { TrackType } from '@/services/machine/player';
import { AlbumDetailRoute } from '@/services/routes';
import usePlayer from '@/store/usePlayer';
import { useLoaderData } from '@tanstack/react-router';
import { m } from 'framer-motion';

const AlbumDetailView: React.FC = () => {
  const { detail } = useLoaderData({ from: AlbumDetailRoute.id });
  const { play } = usePlayer();

  const onPlay = () => {
    play(
      detail.songs.map((item) => ({
        id: item.id,
        type: TrackType.audio,
      })),
    );
  };

  return (
    <PageTransition>
      <m.div>
        <m.img src={detail.cover} />
        <div>{detail.name}</div>

        <div>
          <Button
            type='button'
            className='rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700'
            onClick={onPlay}
          >
            播放全部
          </Button>
        </div>

        <div>
          {detail.songs.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      </m.div>
    </PageTransition>
  );
};

export default AlbumDetailView;
