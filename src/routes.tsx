import { RouteObject } from 'react-router-dom';
import Root from './Root';

const AlbumDetailView = lazy(() => import('./views/AlbumDetailView'));
const ArtistDetailView = lazy(() => import('./views/ArtistDetailView'));
const HomeView = lazy(() => import('./views/HomeView'));
const PlaylistDetailView = lazy(() => import('./views/PlaylistDetailView'));
const SearchView = lazy(() => import('./views/SearchView'));

const routes: RouteObject[] = [
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
];

export default routes;
