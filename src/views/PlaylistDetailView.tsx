import { getSongDetail } from '@/apis';
import PageTransition from '@/components/PageTransition';
import Track from '@/components/Track';
import Button from '@/components/common/Button';
import { TrackType } from '@/services/machine/player';
import { PlaylistDetailRoute } from '@/services/routes';
import usePlayer from '@/store/usePlayer';
import { useQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { m } from 'framer-motion';
import { lastValueFrom } from 'rxjs';

const PlaylistDetailView: React.FC = () => {
  const { detail } = useLoaderData({ from: PlaylistDetailRoute.id });
  const tracks = useQuery({
    queryKey: ['playlist', 'tracks', detail.trackIds],
    queryFn: () => lastValueFrom(getSongDetail(detail.trackIds)),
  });

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
      <m.div className=' sm:bg-red-500'>
        <m.img src={detail.cover} />
        <h1>{detail.name}</h1>
        <p>{detail.description}</p>

        <Button
          onClick={onPlay}
          className='rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700'
        >
          Play
        </Button>

        <ul className='flex flex-col gap-1'>
          {tracks.data?.map((item) => (
            <Track
              key={item.id}
              id={item.id}
              name={item.name}
              cover={item.cover}
              artists={item.artists}
            />
          ))}
        </ul>
      </m.div>
    </PageTransition>
  );
};

export default PlaylistDetailView;
