import { artistKeys } from '@/services/query/keys';
import { AlbumDetailRoute } from '@/services/router/map';
import { cx } from '@emotion/css';
import { css } from '@emotion/react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Link, useRouteContext } from '@tanstack/react-router';
import { format } from 'date-fns';
import { m, useScroll, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const mediaBackgroundImage = (media: string, backgroundImage: string) => css`
  @media ${media} {
    background-image: url(${backgroundImage});
  }
`;

const AlbumDetailView: React.FC = () => {
  const { queryOptions } = useRouteContext({ from: AlbumDetailRoute.id });
  const { t } = useTranslation();

  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ['end end', 'start start'],
  });
  const opacity = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const { data } = useQuery(queryOptions);
  const coverResource = useGenerateResponsiveResources(data?.cover);

  const artistAlbumsQuery = useInfiniteQuery({
    ...artistKeys.albums(data?.artist.id || 0),
    enabled: !!data?.artist.id,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.more ? { offset: allPages.length + 1 } : undefined,
  });

  const albums = useMemo(
    () => artistAlbumsQuery.data?.pages.map((page) => page.hotAlbums).flat(),
    [artistAlbumsQuery.data?.pages],
  );

  const publishTime = useMemo(
    () =>
      data?.times.publish ? format(data?.times.publish, 'yyyy-MM-dd') : '',
    [data?.times.publish],
  );

  if (!data) return null;

  return (
    <m.div>
      <m.div
        ref={target}
        className="relative transition-all"
        style={{
          opacity,
        }}
      >
        <m.div
          css={css`
            ${coverResource.list.map((item) =>
              mediaBackgroundImage(item.media, item.url!),
            )}
          `}
          className={cx(
            'absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat filter blur-3xl',
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <div className="flex flex-col gap-2 p-4 backdrop-blur">
          <div className="flex flex-col items-center justify-center gap-2">
            <Cover src={data.cover} />
            <h2 className="text-center text-xl font-bold dark:text-gray-100">
              {data.name}
            </h2>
          </div>
          <Link
            className="text-center text-lg font-semibold text-gray-500"
            to={`/artist/${data.artist.id}`}
          >
            {data.artist.name}
          </Link>
          <div className="flex gap-4 p-2">
            <PlayButton />
            <PlayButton />
          </div>
        </div>
      </m.div>

      <TrackList
        className="px-4"
        tracks={data.songs}
        renderTrackListInfo={({ duration, count }) => (
          <div className=" select-none">
            <div>{publishTime}</div>
            <div>
              <span>{count} tracks</span>
              <span>
                , {duration.hours}
                {t('unit.hours')}
                {duration.minutes}
                {t('unit.minutes')}
              </span>
            </div>
            {data.company && <div>&copy; {data.company}</div>}
          </div>
        )}
      />

      <div className="p-2 pr-0 dark:text-white flex flex-col gap-2">
        <div>更多关于{data.artist.name}的作品</div>
        <div>
          <ArtistAlbums id={data.artist.id} />
        </div>
      </div>
    </m.div>
  );
};

export default AlbumDetailView;
