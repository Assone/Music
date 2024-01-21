import Image from '@/components/common/Image';
import usePlayer from '@/store/usePlayer';
import type { ConfigurableStyle } from '@/types/props';
import { Link } from '@tanstack/react-router';
import classNames from 'classnames';
import { m } from 'framer-motion';

interface PlayerTrackInfoProps extends Pick<ConfigurableStyle, 'className'> {
  onClick?: () => void;
}

const PlayerTrackInfo: React.FC<PlayerTrackInfoProps> = ({
  className,
  onClick,
}) => {
  const data = usePlayer(
    (state) => state.context.currentTrackResourceInformation,
  );

  return (
    <m.div
      className={classNames('flex items-center gap-1', className)}
      onClick={onClick}
    >
      <Image className='h-10 w-10 flex-shrink-0' src={data?.cover} />
      <div className='flex flex-col gap-1 overflow-hidden'>
        <div className='truncate'>{data?.name}</div>
        {data?.artist ? (
          <div>
            <Link
              className='inline-block'
              to='/artists/$id'
              params={{ id: data.artist.id.toString() }}
            >
              {data.artist.name}
            </Link>
          </div>
        ) : null}
      </div>
    </m.div>
  );
};

export default PlayerTrackInfo;
