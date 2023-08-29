import http from '@/services/http';
import { mapArray } from '@/utils/rxjs';
import { from, map } from 'rxjs';
import { Recommend } from '../path';

/**
 * 获取推荐歌单
 * @param limit 取出数量 , 默认为 30
 */
export const getRecommendPlaylist = (limit?: number) =>
  from(
    http.get<API.Recommend.Playlist>(Recommend.playlist, { params: { limit } }),
  ).pipe(
    map((res) => res.result),
    mapArray(({ id, name, picUrl: cover }) => ({ id, name, cover })),
  );
