import {
  AlbumListArea,
  getAlbumDetail,
  getAlbumListByStyle,
  getArtistAlbums,
  getArtistDetail,
  getArtistMvs,
  getPlaylistDetail,
  getRecommendPlaylist,
  getSimilarArtist,
} from '@/apis';
import { getSearchHotList, getSearchResource } from '@/apis/resources/search';
import {
  createQueryKeys,
  mergeQueryKeys,
} from '@lukemorales/query-key-factory';
import { lastValueFrom } from 'rxjs';

export const homeKeys = createQueryKeys('home', {
  playlist: () => ({
    queryKey: ['playlist'],
    queryFn: () => lastValueFrom(getRecommendPlaylist()),
  }),
  album: () => ({
    queryKey: ['album', AlbumListArea.ea],
    queryFn: () =>
      lastValueFrom(getAlbumListByStyle({ area: AlbumListArea.ea })),
  }),
});

export const playlistKeys = createQueryKeys('playlist', {
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: () => lastValueFrom(getPlaylistDetail(id)),
  }),
});

export const albumKeys = createQueryKeys('album', {
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: () => lastValueFrom(getAlbumDetail(id)),
  }),
});

export const artistKeys = createQueryKeys('artist', {
  albums: (id: number) => ({
    queryKey: [id],
    queryFn: (ctx) => {
      const { limit = 10, offset } = (ctx.pageParam ||
        {}) as API.RequestArgs.PaginationOptions;

      return lastValueFrom(getArtistAlbums(id, { limit, offset }));
    },
  }),
  detail: (id: number) => ({
    queryKey: [id],
    queryFn: ({ signal }) => lastValueFrom(getArtistDetail(id, { signal })),
    contextQueries: {
      mv: () => ({
        queryKey: [id],
        queryFn: () => lastValueFrom(getArtistMvs(id)),
      }),
    },
  }),
});

export const similarKeys = createQueryKeys('similar', {
  artist: (id: number) => ({
    queryKey: [id],
    queryFn: () => lastValueFrom(getSimilarArtist(id)),
  }),
});

export const searchKeys = createQueryKeys('search', {
  resource: (keywords: string) => ({
    queryKey: [keywords],
    queryFn: () => lastValueFrom(getSearchResource(keywords)),
  }),
  hot: () => ({
    queryKey: ['hot'],
    queryFn: ({ signal }) => lastValueFrom(getSearchHotList({ signal })),
  }),
});

export const queryKeys = mergeQueryKeys(
  homeKeys,
  playlistKeys,
  albumKeys,
  artistKeys,
);
