import { getSongDetail } from '@/apis/resources/song';
import Queue from '@/models/Queue';
import { RefObject } from 'react';
import { lastValueFrom } from 'rxjs';
import useIntersectionObserver from './useIntersectionObserver';

export interface Track {
  id: ID;
  name: Name;
  duration: number;
  no?: number;
}

interface UseTracksOptions {
  lazy?: boolean;
  limit?: number;
}

export default function useTracks(
  ids: ID[],
  target: RefObject<HTMLDivElement>,
  { lazy = true, limit = 50 }: UseTracksOptions = {},
) {
  const queue = useRef(new Queue<ID[]>());
  const [tracks, setTracks] = useState<Track[]>([]);

  const fetch = (stop?: VoidFunction) => {
    const idList = queue.current.dequeue();

    if (idList?.length) {
      lastValueFrom(getSongDetail(idList))
        .then((songs) => {
          setTracks((prevTracks) => prevTracks.concat(songs));
        })
        .catch(() => console.error('获取歌曲详情失败'));
    } else {
      stop?.();
    }
  };

  const { resume, stop } = useIntersectionObserver(
    target.current,
    ([{ isIntersecting } = { isIntersecting: false }]) => {
      if (isIntersecting) {
        fetch(stop);
      }
    },
    { immediate: false },
  );

  useEffect(() => {
    queue.current.clear();

    if (ids.length === 0) return;

    if (lazy && ids.length > limit) {
      for (let i = 0; i < ids.length; i += limit) {
        queue.current.enqueue(ids.slice(i, i + limit));
      }
    } else {
      queue.current.enqueue(ids);
    }

    if (lazy) {
      resume();
    } else {
      fetch();
    }
  }, [ids, lazy, limit, resume]);

  return tracks;
}
