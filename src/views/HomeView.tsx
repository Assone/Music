import { homeKeys } from '@/services/query/keys';
import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

const HomeView: React.FC = () => {
  const { data: playlist = [] } = useQuery({
    ...homeKeys.playlist(),
  });
  const { data: albums = [] } = useQuery(homeKeys.album());

  return (
    <div className="flex flex-col gap-2">
      <div>
        <Title>Playlist</Title>
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
        <Title>Album</Title>
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
