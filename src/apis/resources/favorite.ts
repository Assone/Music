import http from '@/services/http';
import { from } from 'rxjs';
import { Favorite } from '../path';

/**
 * 获取收藏的歌手列表
 * @param params 查询参数
 */
export const getFavoriteArtists = (
  params?: API.RequestArgs.PaginationOptions,
) => from(http.get<API.Favorite.Artists>(Favorite.artists, { params }));

/**
 * 获取收藏的专辑列表
 * @param params 查询参数
 */
export const getFavoriteAlbums = (params?: API.RequestArgs.PaginationOptions) =>
  from(http.get<API.Favorite.Albums>(Favorite.albums, { params }));
