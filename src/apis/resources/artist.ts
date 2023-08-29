import http from '@/services/http';
import { from } from 'rxjs';
import { Artist } from '../path';

/**
 * 获取歌手专辑
 * @param id 歌手ID
 * @param params 分页参数
 */
// eslint-disable-next-line import/prefer-default-export
export const getArtistAlbums = (
  id: ID,
  params?: API.Common.PaginationOptions,
) =>
  from(http.get<API.Artist.Album>(Artist.album, { params: { id, ...params } }));
