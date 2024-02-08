import PageTransition from '@/components/PageTransition';
import Swiper from '@/components/Swiper';
import Image from '@/components/common/Image';
import List from '@/components/common/List';
import Typography from '@/components/common/Typography';
import { HomeRoute } from '@/services/routes';
import {
  Await,
  Link,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { m } from 'framer-motion';

const HomeView: React.FC = () => {
  const { playlist, albums } = useLoaderData({ from: HomeRoute.id });
  const navigate = useNavigate();

  const onToTopView = () => {
    // eslint-disable-next-line no-void
    void navigate({ to: '/top' });
  };

  return (
    <PageTransition animate={false}>
      <m.div>
        <Typography.Title level={2}>Playlist</Typography.Title>
        <Await promise={playlist}>
          {(playlist) => (
            <Swiper
              source={playlist}
              sourceKey='id'
              container={{
                slidesPerView: 3.5,
                spaceBetween: 10,
                slidesOffsetBefore: 10,
              }}
            >
              {({ id, cover, name }) => (
                <div key={id} className='overflow-hidden'>
                  <Image src={cover} />
                  <div className='truncate'>
                    <Link to='/playlists/$id' params={{ id: id.toString() }}>
                      {name}
                    </Link>
                  </div>
                </div>
              )}
            </Swiper>
          )}
        </Await>

        <Typography.Title level={2}>Albums</Typography.Title>
        <Await promise={albums}>
          {(albums) => (
            <Swiper
              source={albums}
              sourceKey='id'
              container={{
                slidesPerView: 3.5,
                spaceBetween: 10,
                slidesOffsetBefore: 10,
              }}
            >
              {({ id, cover, name }) => (
                <div key={id} className='overflow-hidden'>
                  <Image src={cover} />
                  <div className='truncate'>
                    <Link to='/albums/$id' params={{ id: id.toString() }}>
                      {name}
                    </Link>
                  </div>
                </div>
              )}
            </Swiper>
          )}
        </Await>
      </m.div>

      <List>
        <List.Item onClick={onToTopView}>排行榜</List.Item>
      </List>
    </PageTransition>
  );
};

export default HomeView;
