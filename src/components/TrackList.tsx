import { Track } from '@/hooks/useTracks';
import { computeDuration } from '@/utils/source';
import { HTMLMotionProps, m } from 'framer-motion';

interface TrackListInfo {
  count: number;
  duration: Duration & { text: string };
}

interface TrackListProps extends Pick<HTMLMotionProps<'ul'>, 'className'> {
  tracks?: Track[] | undefined;
  trackIds?: ID[];
  cover?: boolean;
  artists?: boolean;
  renderTrackListInfo?: (info: TrackListInfo) => React.ReactNode;
}

const TrackList: React.FC<TrackListProps> = ({
  className,
  tracks: source = [],
  trackIds = [],
  cover,
  artists,
  renderTrackListInfo = ({ count, duration }) => (
    <>
      <span>{count} tracks</span>
      <span>, {duration.text}</span>
    </>
  ),
}) => {
  const tail = useRef<HTMLDivElement>(null);
  const { tracks, isFetching } = useTracks(trackIds, tail);
  const list = useMemo<Track[]>(
    () => (source.length ? source : tracks),
    [source, tracks],
  );
  const duration = useMemo(
    () => computeDuration(list.reduce((acc, cur) => acc + cur.duration, 0)),
    [list],
  );

  return (
    <div className={className}>
      <m.ul>
        {list.map((track) => (
          <TrackListItem
            track={track}
            key={track.id}
            cover={cover}
            artists={artists}
          />
        ))}
      </m.ul>
      <div ref={tail} />
      {isFetching && <p>Loading...</p>}
      {isFetching === false && list.length > 0 && (
        <div className="dark:text-gray-500">
          {renderTrackListInfo({ count: list.length, duration })}
        </div>
      )}
    </div>
  );
};

export default TrackList;
