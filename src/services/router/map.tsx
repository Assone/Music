import App from '@/App';
import { UseQueryOptions } from '@tanstack/react-query';
import {
  Route,
  RouterContext,
  defer,
  lazyRouteComponent,
} from '@tanstack/react-router';
import queryClient from '../query/client';
import { queryKeys } from '../query/keys';

const context = new RouterContext<{
  queryClient: typeof queryClient;
}>();

export const RootRoute = context.createRootRoute({
  component: App,
});

export const HomeRoute = new Route({
  path: '/',
  component: lazyRouteComponent(() => import('@/views/HomeView')),
  getParentRoute: () => RootRoute,
});

export const PlaylistDetailRoute = new Route({
  path: '/playlists/$id',
  key: ({ params }) => params.id,
  component: lazyRouteComponent(() => import('@/views/PlaylistDetailView')),
  getParentRoute: () => RootRoute,
  getContext: ({ params: { id } }) => {
    const queryOptions = {
      ...queryKeys.playlist.detail(+id),
      enabled: !!id,
    } satisfies Omit<UseQueryOptions, 'queryKey' | 'queryFn'>;

    return {
      queryOptions,
    };
  },
  loader: ({ context: { queryClient }, routeContext: { queryOptions } }) => ({
    detail: defer(queryClient.ensureQueryData(queryOptions)),
  }),
});

export const AlbumDetailRoute = new Route({
  path: '/albums/$id',
  key: ({ params }) => params.id,
  component: lazyRouteComponent(() => import('@/views/AlbumDetailView')),
  getParentRoute: () => RootRoute,
  getContext: ({ params: { id } }) => {
    const queryOptions = {
      ...queryKeys.album.detail(+id),
      enabled: !!id,
    } satisfies Omit<UseQueryOptions, 'queryKey' | 'queryFn'>;

    return {
      queryOptions,
    };
  },
  loader: ({ context: { queryClient }, routeContext: { queryOptions } }) => ({
    detail: defer(queryClient.ensureQueryData(queryOptions)),
  }),
});
