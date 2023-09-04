import { Track } from '@/hooks/useTracks';
import { formatDuration, normalizeTrackNo } from '@/utils/source';
import { TrackListItemVariants } from '@/utils/variants';
import { cx } from '@emotion/css';
import { Link } from '@tanstack/react-router';
import { m } from 'framer-motion';

interface TrackListItemProps {
  track: Track;
  cover?: boolean;
  album?: boolean;
  artists?: boolean;
  className?: string;
  onClick?: VoidFunction;
}

const TrackListItem: React.FC<TrackListItemProps> = ({
  track,
  cover,
  album,
  artists,
  className,
  onClick,
}) => {
  const index = useMemo(() => normalizeTrackNo(track.no), [track.no]);
  const duration = useMemo(
    () => formatDuration(track.duration),
    [track.duration],
  );

  return (
    <m.li
      className={cx(
        'flex gap-2 text-base text-gray-200 py-2 select-none items-center',
        className,
      )}
      variants={TrackListItemVariants}
      whileTap={{ scale: 1.05, opacity: 0.8 }}
      onClick={onClick}
    >
      {index && (
        <div className="flex min-w-max items-center justify-center">
          {index}
        </div>
      )}
      {cover && (
        <Cover
          className="w-10 h-10 flex-shrink-0"
          src={track.cover}
          alt={track.name}
        />
      )}
      <div className="flex-1 overflow-hidden">
        <Typography.Title level={5} className="truncate font-bold">
          {track.name}
        </Typography.Title>
        {artists && (
          <div className="truncate">
            {track.artists?.map(({ id, name }) => (
              <Link
                className='after:content-[","] last-of-type:after:content-[""] mr-1 last-of-type:mr-0'
                to="/artists/$id"
                params={{ id: id.toString() }}
                key={id}
              >
                <Typography.Text className=" text-sm">{name}</Typography.Text>
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
