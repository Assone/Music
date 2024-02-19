import { getMvUrl } from '@/apis';
import { TrackType } from '@/services/machine/player';
import usePlayer from '@/store/usePlayer';
import { useQuery } from '@tanstack/react-query';

const PlayerTrackVideo: React.FC = () => {
  const context = usePlayer((state) => state.context);
  const isPlaying = usePlayer((state) => state.isPlaying);
  const currentTrack = useMemo(
    () => context.tracks[context.currentTrackIndex!],
    [context.currentTrackIndex, context.tracks],
  );
  const mvQuery = useQuery({
    queryKey: ['mv', 'url', currentTrack],
    queryFn: () => lastValueFrom(getMvUrl(currentTrack!.id)),
    enabled: currentTrack?.type === TrackType.mv,
    select: (data) => data.url,
  });

  if (currentTrack?.type === TrackType.audio || isPlaying === false) {
    return null;
  }

  // eslint-disable-next-line jsx-a11y/media-has-caption
  return <video src={mvQuery.data} autoPlay />;
};

export default PlayerTrackVideo;
