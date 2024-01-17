import Image from '@/components/common/Image';
import usePlayer from '@/store/usePlayer';
import type { ConfigurableStyle } from '@/types/props';

interface PlayerTrackCoverProps
  extends Pick<ConfigurableStyle, 'classname' | 'style'> {}

const PlayerTrackCover: React.FC<PlayerTrackCoverProps> = () => {
  const cover = usePlayer(
    (state) => state.context.currentTrackResourceInformation?.cover,
  );

  return <Image src={cover} />;
};

export default PlayerTrackCover;
