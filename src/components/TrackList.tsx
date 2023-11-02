import { Track } from '@/hooks/useTracks';
import { computeDuration } from '@/utils/source';
import { TrackListVariants } from '@/utils/variants';
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
  onClick?: (track: Track) => void;
}

const TrackList: React.FC<TrackListProps> = ({
  className,
  tracks: source = [],
  trackIds = [],
  cover,
  artists,
  onClick,
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
    () =>
      computeDuration(list.reduce((acc, cur) => acc + (cur?.duration || 0), 0)),
    [list],
  );

  return (
    <div className={className}>
      <m.ul
        variants={TrackListVariants}
        initial={import.meta.env.SSR ? false : 'hidden'}
        animate="show"
      >
        {list.map((track) => (
          <TrackListItem
            track={track}
            key={track.id}
            cover={cover}
            artists={artists}
            onClick={() => onClick?.(track)}
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
