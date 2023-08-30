import { Router } from '@tanstack/react-router';
import queryClient from '../query/client';
import {
  AlbumDetailRoute,
  ArtistDetailRoute,
  HomeRoute,
  PlaylistDetailRoute,
  RootRoute,
  SearchRoute,
} from './map';

const routeTree = RootRoute.addChildren([
  HomeRoute,
  PlaylistDetailRoute,
  AlbumDetailRoute,
  SearchRoute,
  ArtistDetailRoute,
]);

const router = new Router({
  routeTree,
  defaultPreload: 'intent',
  context: {
    queryClient,
  },
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default router;
