import { Track } from '@/hooks/useTracks';
import { formatDuration, normalizeTrackNo } from '@/utils/source';
import { Link } from '@tanstack/react-router';
import { m } from 'framer-motion';
import Image from './Image';

interface TrackListItemProps {
  track: Track;
  cover?: boolean;
  album?: boolean;
  artists?: boolean;
}

const TrackListItem: React.FC<TrackListItemProps> = ({
  track,
  cover,
  album,
  artists,
}) => {
  const index = useMemo(() => normalizeTrackNo(track.no), [track.no]);
  const duration = useMemo(
    () => formatDuration(track.duration),
    [track.duration],
  );

  return (
    <m.li
      className="flex gap-2 text-base text-gray-200 py-2 select-none items-center"
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileTap={{ scale: 1.05, opacity: 0.8 }}
    >
      {index && (
        <div className="flex min-w-max items-center justify-center">
          {index}
        </div>
      )}
      {cover && (
        <Image className="w-10 h-10" src={track.cover} alt={track.name} />
      )}
      <div className="flex-1">
        <div className="truncate">{track.name}</div>
        {artists && (
          <div className="flex gap-1">
            {track.artists?.map(({ id, name }) => (
              <Link
                className='after:content-[","] last-of-type:after:content-[""]'
                to="/artists/$id"
                params={{ id: id.toString() }}
                key={id}
              >
                <Typography.Text>{name}</Typography.Text>
              </Link>
            ))}
          </div>
        )}
      </div>
      {album && track.album && (
        <Link to="/albums/$id" params={{ id: track.album.id.toString() }}>
          <Typography.Text>{track.album?.name}</Typography.Text>
        </Link>
      )}
      <div className="hidden lg:block">{duration}</div>
    </m.li>
  );
};

export default TrackListItem;
