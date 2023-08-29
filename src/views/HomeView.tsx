import {
  AlbumListArea,
  getAlbumListByStyle,
  getRecommendPlaylist,
} from '@/apis';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { lastValueFrom } from 'rxjs';

const HomeView: React.FC = () => {
  const navigate = useNavigate();

  const { data: playlist = [] } = useQuery({
    queryKey: ['recommendPlaylist'],
    queryFn: () => lastValueFrom(getRecommendPlaylist()),
  });
  const { data: albums = [] } = useQuery({
    queryKey: ['recommendAlbums'],
    queryFn: () =>
      lastValueFrom(getAlbumListByStyle({ area: AlbumListArea.ea })),
  });

  const onToPlaylistDetail = (id: ID) => {
    navigate({ to: `/playlists/${id}` });
  };

  const onToAlbumDetail = (id: ID) => {
    navigate({ to: `/albums/${id}` });
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2>Playlist</h2>
        <SwiperContainer
          source={playlist}
          containerProps={{ slidesPerView: 3.5, spaceBetween: 10 }}
        >
          {(item) => (
            <div className="w-full h-full" key={item.id}>
              <Link to="/playlists/$id" params={{ id: item.id.toString() }}>
                <Cover src={item.cover} />
              </Link>
            </div>
          )}
        </SwiperContainer>
      </div>
      <div>
        <h2>Album</h2>
        <SwiperContainer
          source={albums}
          containerProps={{ slidesPerView: 3.5, spaceBetween: 10 }}
        >
          {(item) => (
            <div className="w-full h-full" key={item.id}>
              <Link to="/albums/$id" params={{ id: item.id.toString() }}>
                <Cover src={item.cover} />
              </Link>
            </div>
          )}
        </SwiperContainer>
      </div>
    </div>
  );
};

export default HomeView;
