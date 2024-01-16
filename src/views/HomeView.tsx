import PageTransition from '@/components/PageTransition';
import Swiper from '@/components/Swiper';
import Image from '@/components/common/Image';
import { HomeRoute } from '@/services/routes';
import { Await, Link, useLoaderData } from '@tanstack/react-router';
import { m } from 'framer-motion';

const HomeView: React.FC = () => {
  const { playlist, albums } = useLoaderData({ from: HomeRoute.id });

  return (
    <PageTransition animate={false}>
      <m.div>
        <h2>Playlist</h2>

        <Swiper />
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

        <h2>Albums</h2>
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
    </PageTransition>
  );
};

export default HomeView;
