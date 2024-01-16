import useIntersectionObserver from '@/hooks/common/useIntersectionObserver';
import useTracks from '@/hooks/useTracks';
import { m } from 'framer-motion';
import type { TrackProps } from './Track';
import Track from './Track';
import IF from './common/IF';

export interface TrackListProps {
  source?: TrackProps[];
  ids?: number[];
  index?: boolean;
}

const TrackList: React.FC<TrackListProps> = ({ ids = [], source, index }) => {
  const tail = useRef<HTMLDivElement>(null);

  const { query, tracks } = useTracks(ids);
  const list = useMemo(() => source || tracks, [source, tracks]);

  const onLoadMore = () => {
    query.fetchNextPage().catch((error) => {
      console.debug('[TrackList] fetchNextPage error:', error);
    });
  };

  const { stop } = useIntersectionObserver(tail.current, (entries) => {
    entries.forEach((entry) => {
      if (
        entry.isIntersecting &&
        query.hasNextPage &&
        query.isFetching === false
      ) {
        onLoadMore();
      }

      if (query.hasNextPage === false) {
        stop();
      }
    });
  });

  return (
    <m.ul className='flex flex-col gap-1'>
      {list.map(({ id, name, cover, artists }, currentIndex) => (
        <Track
          id={id}
          name={name}
          cover={cover}
          artists={artists}
          index={index ? currentIndex + 1 : undefined}
          key={id}
        />
      ))}

      <IF condition={query.isFetching}>
        <div>Loading...</div>
      </IF>

      <div ref={tail} />
    </m.ul>
  );
};

export default TrackList;
