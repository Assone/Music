/* eslint-disable no-underscore-dangle */
import Root from '@/Root';
import { UseQueryOptions } from '@tanstack/react-query';
import {
  defer,
  lazyRouteComponent,
  Route,
  RouterContext,
} from '@tanstack/react-router';
import { z } from 'zod';
import queryClient from '../query/client';
import { queryKeys } from '../query/keys';

type QueryOptions = Omit<UseQueryOptions, 'queryKey' | 'queryFn'>;

const context = new RouterContext<{
  queryClient: typeof queryClient;
}>();

export const RootRoute = context.createRootRoute({
  component: Root,
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
  beforeLoad: ({ params: { id } }) => {
    const queryOptions = {
      ...queryKeys.playlist.detail(+id),
      enabled: !!id,
    } satisfies QueryOptions;

    return {
      queryOptions,
    };
  },
  loader: async ({ context: { queryClient, queryOptions } }) => {
    const detail = await queryClient.fetchQuery(queryOptions);

    return {
      detail,
    };
  },
});

export const AlbumDetailRoute = new Route({
  path: '/albums/$id',
  component: lazyRouteComponent(() => import('@/views/AlbumDetailView')),
  getParentRoute: () => RootRoute,
  beforeLoad: ({ params: { id } }) => {
    const queryOptions = {
      ...queryKeys.album.detail(+id),
      enabled: !!id,
    } satisfies QueryOptions;

    return {
      queryOptions,
    };
  },
  loader: async ({ context: { queryClient, queryOptions } }) => {
    const detail = await queryClient.fetchQuery(queryOptions);

    return {
      detail,
    };
  },
});

export const ArtistDetailRoute = new Route({
  path: '/artists/$id',
  component: lazyRouteComponent(() => import('@/views/ArtistDetailView')),
  getParentRoute: () => RootRoute,
  beforeLoad: ({ params: { id } }) => {
    const queryOptions = {
      ...queryKeys.artist.detail(+id),
      enabled: !!id,
    } satisfies QueryOptions;

    return {
      queryOptions,
      id: +id,
    };
  },
  loader: async ({ context: { queryClient, queryOptions, id } }) => {
    const detail = await queryClient.fetchQuery(queryOptions);
    const mv = defer(
      queryClient.fetchQuery({ ...queryKeys.artist.detail(id)._ctx.mv() }),
    );
    const songs = defer(
      queryClient.fetchQuery({ ...queryKeys.artist.detail(id)._ctx.songs() }),
    );

    return {
      detail,
      mv,
      songs,
    };
  },
});

const sourceSearchSchema = z.object({
  page: z.number().or(z.undefined()),
  keyword: z.string().or(z.undefined()),
});

export const SearchRoute = new Route({
  path: '/search',
  component: lazyRouteComponent(() => import('@/views/SearchView')),
  getParentRoute: () => RootRoute,
  validateSearch: sourceSearchSchema,
});
