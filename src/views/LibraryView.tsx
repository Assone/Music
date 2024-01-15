import { getFavoriteAlbums } from '@/apis/resources/favorite';
import { useQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import { lastValueFrom } from 'rxjs';

const LibraryView: React.FC = () => {
  const albumsQuery = useQuery({
    queryKey: ['library', 'favorite', 'albums'],
    queryFn: () => lastValueFrom(getFavoriteAlbums()),
  });

  console.log(albumsQuery.data);

  return (
    <m.div>
      <h1>Library</h1>
      <h2>Playlist</h2>
      <h2>Artists</h2>
      <h2>Albums</h2>
      <h2>Songs</h2>
      <h2>Mvs</h2>
    </m.div>
  );
};

export default LibraryView;
