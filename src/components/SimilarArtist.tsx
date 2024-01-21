import { getSimilarArtist } from '@/apis';
import { useQuery } from '@tanstack/react-query';
import Swiper from './Swiper';

export interface SimilarArtistProps {
  id: number;
}

const SimilarArtist: React.FC<SimilarArtistProps> = ({ id }) => {
  const query = useQuery({
    queryKey: ['similar', 'artist', id],
    queryFn: () => lastValueFrom(getSimilarArtist(id)),
  });

  console.debug(query);

  return <Swiper>{() => <div>x</div>}</Swiper>;
};

export default SimilarArtist;
