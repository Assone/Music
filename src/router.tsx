import { createBrowserRouter } from 'react-router-dom';
import Root from './Root';
import AlbumDetailView from './views/AlbumDetailView';
import ArtistDetailView from './views/ArtistDetailView';
import HomeView from './views/HomeView';
import PlaylistDetailView from './views/PlaylistDetailView';
import SearchView from './views/SearchView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <HomeView /> },
      { path: '/playlists/:id', element: <PlaylistDetailView /> },
      { path: '/albums/:id', element: <AlbumDetailView /> },
      { path: '/artists/:id', element: <ArtistDetailView /> },
      { path: '/search', element: <SearchView /> },
    ],
  },
]);

export default router;
