import Image from '@/components/common/Image';
import { HomeRoute } from '@/services/routes';
import { Await, Link, useLoaderData } from '@tanstack/react-router';

const HomeView: React.FC = () => {
  const { playlist, albums } = useLoaderData({ from: HomeRoute.id });

  return (
    <div>
      <h2>Playlist</h2>
      <Await promise={playlist}>
        {(playlist) => (
          <div className='grid grid-cols-4 gap-2'>
            {playlist.map((item) => (
              <div key={item.id} className='overflow-hidden'>
                <Image src={item.cover} />
                <div className='truncate'>
                  <Link to='/playlists/$id' params={{ id: item.id.toString() }}>
                    {item.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Await>

      <h2>Albums</h2>
      <Await promise={albums}>
        {(albums) => (
          <div className='grid grid-cols-2 gap-2'>
            {albums.map((item) => (
              <div key={item.id} className='overflow-hidden'>
                <Image src={item.cover} />
                <div className='truncate'>
                  <Link to='/playlists/$id' params={{ id: item.id.toString() }}>
                    {item.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Await>
    </div>
  );
};

export default HomeView;
