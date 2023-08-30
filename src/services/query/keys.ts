import {
  AlbumListArea,
  getAlbumDetail,
  getAlbumListByStyle,
  getArtistAlbums,
  getPlaylistDetail,
  getRecommendPlaylist,
  getSimilarArtist,
} from '@/apis';
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
    queryFn: (ctx) =>
      lastValueFrom(
        getArtistAlbums(id, ctx.pageParam as API.Common.PaginationOptions),
      ),
  }),
});

export const similarKeys = createQueryKeys('similar', {
  artist: (id: number) => ({
    queryKey: [id],
    queryFn: () => lastValueFrom(getSimilarArtist(id)),
  }),
});

export const queryKeys = mergeQueryKeys(
  homeKeys,
  playlistKeys,
  albumKeys,
  artistKeys,
);
