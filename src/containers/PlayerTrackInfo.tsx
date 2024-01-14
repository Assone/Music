import usePlayer from '@/store/usePlayer';
import { Link } from '@tanstack/react-router';
import { m } from 'framer-motion';

const PlayerTrackInfo: React.FC = () => {
  const data = usePlayer(
    (state) => state.context.currentTrackResourceInformation,
  );

  if (!data) return null;

  return (
    <m.div className='flex items-center justify-center gap-1'>
      <m.img className='h-10 w-10' src={data?.cover} />
      <div className='flex flex-col gap-1 overflow-hidden'>
        <div className='truncate'>{data?.name}</div>
        {data.artist ? (
          <Link to='/artists/$id' params={{ id: data.artist.id.toString() }}>
            {data.artist.name}
          </Link>
        ) : null}
      </div>
    </m.div>
  );
};

export default PlayerTrackInfo;
