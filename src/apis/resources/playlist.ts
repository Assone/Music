import http from '@/services/http';
import { formatSong } from '@/utils/format';
import { mapArray } from '@/utils/rxjs';
import { from, map } from 'rxjs';
import { Playlist } from '../path';

/**
 * 获取歌单详情
 * @param id 歌单id
 * @param collectorsCount 收藏者数量
 */
export const getPlaylistDetail = (id: ID, collectorsCount?: number) =>
  from(
    http.get<API.Playlist.Detail>(Playlist.detail, {
      params: { id, s: collectorsCount },
    }),
  ).pipe(
    map(({ playlist }) => playlist),
    map((detail) => {
      const {
        id,
        name,
        description,
        coverImgUrl: cover,
        trackIds: ids,
      } = detail;
      const trackIds = ids.map(({ id }) => id);

      return {
        id,
        name,
        description,
        cover,
        trackIds,
      };
    }),
  );

/**
 * 获取歌单所有歌曲
 * @param id 歌单id
 * @param options 分页参数
 */
export const getPlaylistAllTrack = (
  id: ID,
  options?: API.RequestArgs.PaginationOptions,
) =>
  from(
    http.get<API.Song.Detail>(Playlist.tracks, {
      params: { id, ...options },
    }),
  ).pipe(
    map(({ songs }) => songs),
    mapArray(formatSong),
  );
