import http from '@/services/http';
import { formatSong, formatSourceInfo } from '@/utils/format';
import { mapArray } from '@/utils/rxjs';
import { from, map } from 'rxjs';
import { Artist } from '../path';

/**
 * 获取歌手专辑
 * @param id 歌手ID
 * @param params 分页参数
 */
export const getArtistAlbums = (
  id: ID,
  params?: API.RequestArgs.PaginationOptions,
) =>
  from(
    http.get<API.Artist.Album>(Artist.album, { params: { id, ...params } }),
  ).pipe(
    map((res) => res.hotAlbums),
    mapArray((album) => {
      const sourceInfo = formatSourceInfo(album);
      const cover = album.picUrl;

      return {
        ...sourceInfo,
        cover,
      };
    }),
  );

/**
 * 获取歌手详情
 * @param id 歌手ID
 * @param config 请求配置
 */
export const getArtistDetail = (id: ID) =>
  from(http.get<API.Artist.Detail>(Artist.detail, { params: { id } })).pipe(
    map((res) => res.data.artist),
  );

/**
 * 获取歌手MV
 * @param id 歌手ID
 */
export const getArtistMvs = (id: ID) =>
  from(http.get<API.Artist.MV>(Artist.mv, { params: { id } })).pipe(
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

/**
 * 获取歌手歌曲
 * @param id 歌手ID
 */
export const getArtistSongs = (id: ID) =>
  from(http.get<API.Artist.Songs>(Artist.songs, { params: { id } })).pipe(
    map((res) => res.hotSongs),
    mapArray(formatSong),
  );
