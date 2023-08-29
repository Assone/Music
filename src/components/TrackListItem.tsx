import { Track } from '@/hooks/useTracks';
import { formatDuration, normalizeTrackNo } from '@/utils/source';
import { m } from 'framer-motion';

interface TrackListItemProps {
  track: Track;
}

const TrackListItem: React.FC<TrackListItemProps> = ({ track }) => {
  const index = useMemo(() => normalizeTrackNo(track.no), [track.no]);
  const duration = useMemo(
    () => formatDuration(track.duration),
    [track.duration],
  );

  return (
    <m.li
      className="flex gap-2 text-base text-gray-200 py-2 select-none "
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
      <div className="flex-1 truncate">{track.name}</div>
      <div className="hidden lg:block">{duration}</div>
    </m.li>
  );
};

export default TrackListItem;
