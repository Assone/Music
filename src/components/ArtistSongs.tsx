import { getArtistSongs } from '@/apis';
import { useQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import Track from './Track';

export interface ArtistSongsProps {
  id: number;
}

const ArtistSongs: React.FC<ArtistSongsProps> = ({ id }) => {
  const query = useQuery({
    queryKey: ['artist', 'songs', id],
    queryFn: () => lastValueFrom(getArtistSongs(id)),
    initialData: [],
  });

  return (
    <m.div>
      {query.data.map(({ id, name, artists }) => (
        <Track id={id} name={name} artists={artists} key={id} />
      ))}
    </m.div>
  );
};

export default ArtistSongs;
