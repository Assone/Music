import { PlayerTrack, TrackType } from '@/player.machine';
import { albumKeys } from '@/services/query/keys';
import { useQuery } from '@tanstack/react-query';
import classnames from 'classnames';
import { format } from 'date-fns';
import { m, useScroll, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const AlbumDetailView: React.FC = () => {
  const { id } = useParams<'id'>();
  const { data: detail } = useQuery(albumKeys.detail(+id!));
  const { t } = useTranslation();

  const { generateMediaQueriesClass } = useGenerateResponsiveResources(
    detail?.cover,
  );

  const publishTime = useMemo(
    () =>
      detail?.times.publish ? format(detail?.times.publish, 'yyyy-MM-dd') : '',
    [detail?.times.publish],
  );

  const target = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target,
    offset: ['end end', 'start start'],
  });
  const opacity = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.01,
  });

  const player = usePlayer();
  const tracks = useMemo<PlayerTrack[]>(
    () =>
      detail?.songs.map((song) => ({
        id: song.id,
        type: TrackType.song,
      })) || [],
    [detail?.songs],
  );

  const onPlay = useCallback(() => {
    player.onSetTrackAndPlay(tracks);
  }, [player, tracks]);

  const onShufflePlay = useCallback(() => {
    player.onSetMode('shuffle');
    player.onSetTrackAndPlay(tracks);
  }, [player, tracks]);

  return (
    <m.div className="flex flex-col gap-2">
      <m.div
        ref={target}
        className="relative transition-all"
        style={{
          opacity,
        }}
      >
        <m.div
          className={classnames(
            'absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat filter blur-3xl',
            generateMediaQueriesClass(
              ({ url }) => `background-image: url(${url})`,
            ),
          )}
          initial={import.meta.env.SSR ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <div className="flex flex-col gap-2 p-4 backdrop-blur">
          <div className="flex flex-col items-center justify-center gap-2">
            <Cover src={detail?.cover} />
            <h2 className="text-center text-xl font-bold dark:text-gray-100">
              {detail?.name}
            </h2>
          </div>
          <Link
            className="text-center text-lg font-semibold text-gray-500"
            to={`/artists/${detail?.artist.id}`}
          >
            {detail?.artist.name}
          </Link>
          <div className="flex gap-4 p-2">
            <PlayButton onClick={onPlay}>播放</PlayButton>
            <PlayButton onClick={onShufflePlay}>随机播放</PlayButton>
          </div>
        </div>
      </m.div>

      <TrackList
        className="px-4"
        tracks={detail?.songs}
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
            {detail?.company && <div>&copy; {detail.company}</div>}
          </div>
        )}
      />

      <div className="p-2 pr-0 dark:text-white flex flex-col gap-2">
        <div>更多关于{detail?.artist.name}的作品</div>
        <div>
          <ArtistAlbums id={detail?.artist.id} limit={10} />
        </div>
      </div>
    </m.div>
  );
};

export default AlbumDetailView;
