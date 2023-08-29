import http from '@/services/http';
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
