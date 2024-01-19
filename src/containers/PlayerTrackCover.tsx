import Image from '@/components/common/Image';
import usePlayer from '@/store/usePlayer';
import type { ConfigurableStyle } from '@/types/props';

interface PlayerTrackCoverProps
  extends Pick<ConfigurableStyle, 'className' | 'style'> {}

const PlayerTrackCover: React.FC<PlayerTrackCoverProps> = ({
  className,
  style,
}) => {
  const cover = usePlayer(
    (state) => state.context.currentTrackResourceInformation?.cover,
  );

  return (
    <Image
      className={className}
      style={style}
      src={cover}
      placeholder={<div className='h-full w-full bg-neutral-400' />}
    />
  );
};

export default PlayerTrackCover;
