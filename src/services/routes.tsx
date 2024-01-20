import Root from '@/Root';
import {
  AlbumListArea,
  getAlbumDetail,
  getAlbumListByStyle,
  getArtistDetail,
  getArtistMvs,
  getArtistSongs,
  getPlaylistDetail,
  getRecommendPlaylist,
} from '@/apis';
import { hotListQueryOptions } from '@/components/SearchHotKeywords';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import {
  Route,
  defer,
  lazyRouteComponent,
  rootRouteWithContext,
} from '@tanstack/react-router';
import { lastValueFrom } from 'rxjs';
import { z } from 'zod';
import queryClient from './query-client';

export interface RouterContext {
  queryClient: QueryClient;
}

export const RootRoute = rootRouteWithContext<RouterContext>()({
  component: Root,
  loader: () => ({ dehydratedState: dehydrate(queryClient) }),
});

export const HomeRoute = new Route({
  getParentRoute: () => RootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('@/views/HomeView')),
  loader: ({ context }) => {
    const playlist = context.queryClient.fetchQuery({
      queryKey: ['home', 'playlist'],
      queryFn: () => lastValueFrom(getRecommendPlaylist()),
    });
    const albums = context.queryClient.fetchQuery({
      queryKey: ['home', 'album', AlbumListArea.ea],
      queryFn: () =>
        lastValueFrom(getAlbumListByStyle({ area: AlbumListArea.ea })),
    });

    return {
      playlist: defer(playlist),
      albums: defer(albums),
    };
  },
});

export const PlaylistDetailRoute = new Route({
  getParentRoute: () => RootRoute,
  path: '/playlists/$id',
  component: lazyRouteComponent(() => import('@/views/PlaylistDetailView')),
  loader: async ({ context, params }) => {
    const detail = await context.queryClient.fetchQuery({
      queryKey: ['playlist', params.id],
      queryFn: () => lastValueFrom(getPlaylistDetail(Number(params.id))),
    });

    return {
      detail,
    };
  },
});

export const AlbumDetailRoute = new Route({
  getParentRoute: () => RootRoute,
  path: '/albums/$id',
  component: lazyRouteComponent(() => import('@/views/AlbumDetailView')),
  loader: async ({ context, params }) => {
    const detail = await context.queryClient.fetchQuery({
      queryKey: ['albums', 'detail', params.id],
      queryFn: () => lastValueFrom(getAlbumDetail(Number(params.id))),
    });

    return {
      detail,
    };
  },
});

export const ArtistDetailRoute = new Route({
  getParentRoute: () => RootRoute,
  path: '/artists/$id',
  component: lazyRouteComponent(() => import('@/views/ArtistDetailView')),
  loader: async ({ context, params }) => {
    const detail = await context.queryClient.fetchQuery({
      queryKey: ['artists', 'detail', params.id],
      queryFn: () => lastValueFrom(getArtistDetail(Number(params.id))),
    });
    const mv = context.queryClient.ensureQueryData({
      queryKey: ['artists', 'mv', params.id],
      queryFn: () => lastValueFrom(getArtistMvs(Number(params.id))),
    });
    const songs = context.queryClient.ensureQueryData({
      queryKey: ['artists', 'songs', params.id],
      queryFn: () => lastValueFrom(getArtistSongs(Number(params.id))),
    });
    const album = context.queryClient.ensureQueryData({
      queryKey: ['artists', 'album', params.id],
      queryFn: () => lastValueFrom(getArtistSongs(Number(params.id))),
    });

    return {
      detail,
      mv: defer(mv),
      songs: defer(songs),
      album: defer(album),
    };
  },
});

const resourceSearchSchema = z.object({
  keyword: z.string().or(z.undefined()),
});

export type ResourceSearchSchema = z.infer<typeof resourceSearchSchema>;

export const SearchRoute = new Route({
  getParentRoute: () => RootRoute,
  path: '/search',
  component: lazyRouteComponent(() => import('@/views/SearchView')),
  validateSearch: resourceSearchSchema,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(hotListQueryOptions);
  },
});

export const LibraryRoute = new Route({
  getParentRoute: () => RootRoute,
  path: '/library',
  component: lazyRouteComponent(() => import('@/views/LibraryView')),
});

// eslint-disable-next-line react-refresh/only-export-components
export const routeTree = RootRoute.addChildren([
  HomeRoute,
  PlaylistDetailRoute,
  AlbumDetailRoute,
  ArtistDetailRoute,
  SearchRoute,
  LibraryRoute,
]);
