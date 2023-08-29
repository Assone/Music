import { computeDuration } from '@/utils/source';
import { HTMLMotionProps, m } from 'framer-motion';

interface Track {
  id: ID;
  name: Name;
  duration: number;
  no?: number;
}

interface TrackListInfo {
  count: number;
  duration: Duration & { text: string };
}

interface TrackListProps extends Pick<HTMLMotionProps<'ul'>, 'className'> {
  tracks?: Track[] | undefined;
  trackIds?: ID[];
  renderTrackListInfo?: (info: TrackListInfo) => React.ReactNode;
}

const TrackList: React.FC<TrackListProps> = ({
  className,
  tracks: source = [],
  trackIds = [],
  renderTrackListInfo = ({ count, duration }) => (
    <>
      <span>{count} tracks</span>
      <span>, {duration.text}</span>
    </>
  ),
}) => {
  const tail = useRef<HTMLDivElement>(null);
  const tracks = useTracks(trackIds, tail);
  const list = useMemo(
    () => (source.length ? source : tracks),
    [source, tracks],
  );
  const duration = useMemo(
    () => computeDuration(list.reduce((acc, cur) => acc + cur.duration, 0)),
    [list],
  );

  return (
    <m.ul className={className}>
      {list.map((track) => (
        <TrackListItem track={track} key={track.id} />
      ))}
      <div ref={tail} />
      {list.length > 0 && (
        <div className="dark:text-gray-500">
          {renderTrackListInfo({ count: list.length, duration })}
        </div>
      )}
    </m.ul>
  );
};

export default TrackList;
