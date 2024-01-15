import { m } from 'framer-motion';
import IconAlbumOutline from '~icons/material-symbols/album-outline';
import IconArtistOutline from '~icons/material-symbols/artist-outline';
import IconMusicNoteRounded from '~icons/material-symbols/music-note-rounded';
import IconMusicVideoOutline from '~icons/material-symbols/music-video-outline';
import IconQueueMusicRounded from '~icons/material-symbols/queue-music-rounded';

const LibraryView: React.FC = () => {
  const list: { title: string; icon: React.ReactNode }[] = [
    { title: 'Playlist', icon: <IconQueueMusicRounded /> },
    { title: 'Artists', icon: <IconArtistOutline /> },
    { title: 'Albums', icon: <IconAlbumOutline /> },
    { title: 'Songs', icon: <IconMusicNoteRounded /> },
    { title: 'Mvs', icon: <IconMusicVideoOutline /> },
  ];

  return (
    <m.div>
      <h1>Library</h1>

      {list.map(({ title, icon }) => (
        <button
          key={title}
          type='button'
          className='flex items-center justify-start gap-1'
        >
          {icon}
          {title}
        </button>
      ))}
    </m.div>
  );
};

export default LibraryView;
