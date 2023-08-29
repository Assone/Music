import App from '@/App';
import { UseQueryOptions } from '@tanstack/react-query';
import {
  Route,
  RouterContext,
  lazyRouteComponent,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import queryClient from '../query/client';
import { queryKeys } from '../query/keys';

const context = new RouterContext<{
  queryClient: typeof queryClient;
}>();

export const RootRoute = context.createRootRoute({
  component: () => (
    <>
      <App />
      <TanStackRouterDevtools />
    </>
  ),
});

export const HomeRoute = new Route({
  path: '/',
  component: lazyRouteComponent(() => import('@/views/HomeView')),
  getParentRoute: () => RootRoute,
});

export const PlaylistDetailRoute = new Route({
  path: '/playlists/$id',
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
  loader: async ({
    context: { queryClient },
    routeContext: { queryOptions },
  }) => {
    await queryClient.ensureQueryData(queryOptions);
  },
});

export const AlbumDetailRoute = new Route({
  path: '/albums/$id',
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
  loader: async ({
    context: { queryClient },
    routeContext: { queryOptions },
  }) => {
    await queryClient.ensureQueryData(queryOptions);
  },
});
