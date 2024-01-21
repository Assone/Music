import { getSimilarPlaylist } from '@/apis';
import { useQuery } from '@tanstack/react-query';
import Swiper from './Swiper';

export interface SimilarPlaylistProps {
  id: number;
}

const SimilarPlaylist: React.FC<SimilarPlaylistProps> = ({ id }) => {
  const query = useQuery({
    queryKey: ['similar', 'playlist', id],
    queryFn: () => lastValueFrom(getSimilarPlaylist(id)),
  });

  console.debug(query);

  return <Swiper>{() => <div>x</div>}</Swiper>;
};

export default SimilarPlaylist;
