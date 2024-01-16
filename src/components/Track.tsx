import type { Artist } from '@/types/api/common';
import { Link } from '@tanstack/react-router';
import { m } from 'framer-motion';
import IF from './common/IF';

const normalizeTrackNo = (trackNo?: number) =>
  trackNo ? String(trackNo).padStart(2, '0') : undefined;

export interface TrackProps {
  name: string;
  id: number;
  cover?: string;
  artists?: Pick<Artist, 'name' | 'id'>[];
  index?: number;
}

const Track: React.FC<TrackProps> = ({
  id,
  name,
  cover,
  artists = [],
  index,
}) => {
  const trackNo = useMemo(() => normalizeTrackNo(index), [index]);

  return (
    <m.li key={id} className='flex items-center gap-1'>
      <IF condition={trackNo !== undefined}>
        <span>{trackNo}</span>
      </IF>
      <IF condition={cover !== undefined}>
        <m.img className='h-10 w-10' src={cover} loading='lazy' />
      </IF>
      <div className='flex flex-col gap-1 overflow-hidden'>
        <span className='truncate' title={name}>
          {name}
        </span>
        <IF condition={artists.length > 0}>
          <div className='truncate'>
            {artists?.map((artist) => (
              <Link
                className='mr-1 after:content-[","] last-of-type:mr-0 last-of-type:after:content-[""]'
                key={artist.id}
                to='/artists/$id'
                params={{ id: artist.id.toString() }}
              >
                {artist.name}
              </Link>
            ))}
          </div>
        </IF>
      </div>
    </m.li>
  );
};

export default Track;
