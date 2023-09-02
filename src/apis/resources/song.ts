import http from '@/services/http';
import { mapArray } from '@/utils/rxjs';
import { from, map } from 'rxjs';
import { Song } from '../path';

/**
 * 获取歌曲详情
 * @param ids 音乐ID
 */
// eslint-disable-next-line import/prefer-default-export
export const getSongDetail = (ids: ID | ID[]) =>
  from(http.get<API.Song.Detail>(Song.detail, { params: { ids } })).pipe(
    map(({ songs }) => songs),
    mapArray((song) => {
      const { dt: duration, name, id, al, ar } = song;
      const cover = al?.picUrl;
      const artists = ar.map(({ id, name }) => ({ id, name }));
      const album = {
        id: al.id,
        name: al.name,
        cover: al.picUrl,
      };

      return {
        id,
        name,
        duration,
        cover,
        artists,
        album,
      };
    }),
  );
