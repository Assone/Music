import http from '@/services/http';
import { formatSourceInfo } from '@/utils/format';
import { mapArray } from '@/utils/rxjs';
import { from, map } from 'rxjs';
import { Artist } from '../path';
import { RequestConfig } from '../type';

/**
 * 获取歌手专辑
 * @param id 歌手ID
 * @param params 分页参数
 */
// eslint-disable-next-line import/prefer-default-export
export const getArtistAlbums = (
  id: ID,
  params?: API.RequestArgs.PaginationOptions,
) =>
  from(http.get<API.Artist.Album>(Artist.album, { params: { id, ...params } }));

/**
 * 获取歌手详情
 * @param id 歌手ID
 * @param config 请求配置
 */
export const getArtistDetail = (id: ID, config?: RequestConfig) =>
  from(
    http.get<API.Artist.Detail>(Artist.detail, { params: { id }, ...config }),
  ).pipe(map((res) => res.data.artist));

/**
 * 获取歌手MV
 * @param id 歌手ID
 */
export const getArtistMvs = (id: ID) =>
  from(http.get<API.Artist.Mv>(Artist.mv, { params: { id } })).pipe(
    map((res) => res.mvs),
    mapArray((mv) => {
      const sourceInfo = formatSourceInfo(mv);
      const { imgurl16v9: cover } = mv;

      return {
        ...sourceInfo,
        cover,
      };
    }),
  );
