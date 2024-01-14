import type { Artist } from '@/types/api/common';
import { Link } from '@tanstack/react-router';
import { m } from 'framer-motion';
import IF from './common/IF';

export interface TrackProps {
  name: string;
  id: number;
  cover?: string;
  artist?: Pick<Artist, 'name' | 'id'>;
}

const Track: React.FC<TrackProps> = ({ id, name, cover, artist }) => (
  <m.li key={id} className='flex items-center gap-1'>
    <IF condition={cover !== undefined}>
      <m.img className='h-10 w-10' src={cover} loading='lazy' />
    </IF>
    <div className='flex flex-col gap-1'>
      <span>{name}</span>
      {artist && (
        <Link to='/artists/$id' params={{ id: artist.id.toString() }}>
          {artist.name}
        </Link>
      )}
    </div>
  </m.li>
);

export default Track;
