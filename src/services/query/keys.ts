import { getAlbumDetail, getArtistAlbums, getPlaylistDetail } from '@/apis';
import {
  createQueryKeys,
  mergeQueryKeys,
} from '@lukemorales/query-key-factory';
import { lastValueFrom } from 'rxjs';

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

export const queryKeys = mergeQueryKeys(playlistKeys, albumKeys, artistKeys);