import { PlayerTrack, TrackType } from '@/player.machine';
import { queryKeys } from '@/services/query/keys';
import { useQuery } from '@tanstack/react-query';

const PlaylistDetailView: React.FC = () => {
  const { id } = useParams<'id'>();
  const { data, isFetched } = useQuery(queryKeys.playlist.detail(+id!));
  const trackIds = useMemo(() => data?.trackIds || [], [data?.trackIds]);

  const player = usePlayer();

  const tracks = useMemo<PlayerTrack[]>(
    () =>
      trackIds.map((id) => ({
        id,
        type: TrackType.song,
      })),
    [trackIds],
  );

  const onPlay = useCallback(() => {
    player.onSetTrackAndPlay(tracks);
  }, [player, tracks]);

  const onShufflePlay = useCallback(() => {
    player.onSetMode('shuffle');
    player.onSetTrackAndPlay(tracks);
  }, [player, tracks]);

  return (
    <div>
      {isFetched && (
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <Cover src={data?.cover} />
            <h2 className="text-center text-xl font-bold dark:text-gray-100">
              {data?.name}
            </h2>
          </div>
          <div className="flex gap-4 p-2">
            <PlayButton onClick={onPlay}>播放</PlayButton>
            <PlayButton onClick={onShufflePlay}>随机播放</PlayButton>
          </div>
        </div>
      )}
      <TrackList className="px-4" trackIds={trackIds} cover artists />
    </div>
  );
};

export default PlaylistDetailView;
