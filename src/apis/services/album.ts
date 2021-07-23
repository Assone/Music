import { ALBUM } from '@/config/path';
import http from '@/libs/http';
import MAlbum from '@/models/Album';
import MSong from '@/models/Song';

/**
 * 获取专辑详情
 * @param id 专辑ID
 */
export const getAlbumDetail = (id: number) =>
  http
    .get<{
      album: IrAlbumDetail;
      resourceState: boolean;
      songs: IrSongDetail[];
    }>(ALBUM.detail, {
      params: { id },
    })
    .then(({ album, songs }) => ({
      album: new MAlbum(album),
      songs: songs.map((song) => new MSong(song)),
    }));

/**
 * 获取专辑信息
 * @param id 专辑ID
 */
export const getAlbumInfo = (id: number) => http.get(ALBUM.info, { params: { id } });

/**
 * 获取全部新碟
 * @param options 选项
 * @param options.limit 返回数量
 * @param options.offset 偏移位置
 * @param options.area ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 */
export const getAlbumNew = (options?: { limit?: number; offset?: number; area: 'ALL' | 'ZH' | 'EA' | 'KR' | 'JP' }) =>
  http
    .get<{ albums: IrAlbumDetail[]; total: number }>(ALBUM.new, {
      params: {
        limit: options?.limit,
        offset: options?.offset,
        area: options?.area,
      },
    })
    .then(({ albums, total }) => ({
      total,
      albums: albums.map((album) => new MAlbum(album)),
    }));

/**
 * 获取最新专辑
 */
export const getAlbumNewest = () =>
  http.get<{ albums: IrAlbumDetail[] }>(ALBUM.newest).then(({ albums }) => albums.map((album) => new MAlbum(album)));

/**
 * 获取
 * @param limit 返回数量
 * @param offset 偏移位置
 */
export const getDigitalAlbumNew = (limit?: number, offset?: number) =>
  http.get(ALBUM.digitalNew, { params: { limit, offset } });

/**
 * 获取数字专辑-语种风格馆
 * @param options 选项
 * @param options.limit 返回数量
 * @param options.offset 偏移位置
 * @param options.area 地区 Z_H:华语,E_A:欧美,KR:韩国,JP:日本
 */
export const getDigitalAlbumStyle = (options?: {
  limit?: number;
  offset?: number;
  area: 'Z_H' | 'E_A' | 'KR' | 'JP';
}) => http.get(ALBUM.digitalStyleList, { params: options });

/**
 * 获取数字专辑详情
 * @param id 专辑ID
 */
export const getDigitalAlbumDetail = (id: number) => http.get(ALBUM.digitalDetail, { params: { id } });
