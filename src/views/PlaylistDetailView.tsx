import { getSongDetail } from '@/apis';
import Track from '@/components/Track';
import { TrackType } from '@/services/machine/player';
import { PlaylistDetailRoute } from '@/services/routes';
import usePlayer from '@/store/usePlayer';
import { useQuery } from '@tanstack/react-query';
import { useLoaderData } from '@tanstack/react-router';
import { m } from 'framer-motion';
import { lastValueFrom } from 'rxjs';

const PlaylistDetailView: React.FC = () => {
  const { detail } = useLoaderData({ from: PlaylistDetailRoute.id });
  const play = usePlayer((state) => state.play);
  const tracks = useQuery({
    queryKey: ['playlist', 'tracks', detail.trackIds],
    queryFn: () => lastValueFrom(getSongDetail(detail.trackIds)),
  });

  return (
    <m.div>
      <m.img src={detail.cover} />
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

      <ul className='flex flex-col gap-1'>
        {tracks.data?.map((item) => (
          <Track
            key={item.id}
            id={item.id}
            name={item.name}
            cover={item.cover}
            artist={item.artists[0]}
          />
        ))}
      </ul>
    </m.div>
  );
};

export default PlaylistDetailView;
