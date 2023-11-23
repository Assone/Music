/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-underscore-dangle */
import { dehydrate } from '@tanstack/react-query';
import { RouteObject, json } from 'react-router-dom';
import Root from './Root';
import queryClient from './services/query/client';
import { queryKeys } from './services/query/keys';

const AlbumDetailView = lazy(() => import('./views/AlbumDetailView'));
const ArtistDetailView = lazy(() => import('./views/ArtistDetailView'));
const HomeView = lazy(() => import('./views/HomeView'));
const PlaylistDetailView = lazy(() => import('./views/PlaylistDetailView'));
const SearchView = lazy(() => import('./views/SearchView'));
const NotFundView = lazy(() => import('./views/NotFoundView'));

const routes: RouteObject[] = [
  {
    path: '/',
    id: 'root',
    loader: () => json({ clientState: dehydrate(queryClient) }),
    element: <Root />,
    children: [
      {
        index: true,
        element: <HomeView />,
        loader: () => {
          queryClient.prefetchQuery(queryKeys.home.playlist());
          queryClient.prefetchQuery(queryKeys.home.album());

          return {};
        },
      },
      {
        path: '/playlists/:id',
        element: <PlaylistDetailView />,
        loader: async ({ params: { id } }) => {
          const detail = await queryClient.fetchQuery(
            queryKeys.playlist.detail(+id!),
          );

          return {
            detail,
          };
        },
      },
      {
        path: '/albums/:id',
        element: <AlbumDetailView />,
        loader: async ({ params: { id } }) => {
          const detail = await queryClient.fetchQuery(
            queryKeys.album.detail(+id!),
          );

          return {
            detail,
          };
        },
      },
      {
        path: '/artists/:id',
        element: <ArtistDetailView />,
        loader: async ({ params: { id } }) => {
          const data = await queryClient.fetchQuery(
            queryKeys.artist.detail(+id!),
          );
          queryClient.prefetchQuery(queryKeys.artist.detail(+id!)._ctx.mv());
          queryClient.prefetchQuery(queryKeys.artist.detail(+id!)._ctx.songs());

          return {
            data,
          };
        },
      },
      {
        path: '/search',
        element: <SearchView />,
        loader: async () => {
          const hotList = await queryClient.fetchQuery(queryKeys.search.hot());

          return {
            hotList,
          };
        },
      },
      {
        path: '*',
        element: <Navigate to="/404" />,
      },
      {
        path: '/404',
        element: <NotFundView />,
      },
    ],
  },
];

export default routes;
