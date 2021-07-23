import { ARTIST } from '@/config/path';
import http from '@/libs/http';
import MAlbum from '@/models/Album';
import MArtist from '@/models/Artist';
import MArtistMV from '@/models/ArtistMV';
import MSong from '@/models/Song';

/**
 * 获取歌手分类列表
 * @param options 选项
 * @param options.limit 返回数量
 * @param options.offset 偏移位置
 * @param options.initial 按首字母索引查找参数
 * @param options.type 歌手类型：
 * -1:全部
 * 1:男歌手
 * 2:女歌手
 * 3:乐队
 * @param options.area 地区类型：
 * -1:全部
 * 0:其他
 * 7华语
 * 8:日本
 * 16韩国
 * 96欧美
 */
export const getArtists = (options?: {
  limit?: number;
  offset?: number;
  initial?: string;
  type?: -1 | 1 | 2 | 3;
  area?: -1 | 0 | 7 | 8 | 16 | 96;
}) => http.get(ARTIST.classification, { params: options });

/**
 * 获取歌手热门50首歌曲
 * @param id 歌手ID
 */
export const getArtistSongHot = (id: number) =>
  http
    .get<{ more: boolean; songs: IrSongDetail[] }>(ARTIST.songsHot, {
      params: { id },
    })
    .then(({ songs }) => songs.map((song) => new MSong(song)));

/**
 * 获取歌手全部歌曲
 * @param id 歌手ID
 * @param options 选项
 * @param options.order hot ,time 按照热门或者时间排序
 * @param options.limit 取出歌单数量 , 默认为 50
 * @param options.offset 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
 */
export const getArtistSongAll = (id: number, options?: { order?: 'hot' | 'time'; limit?: number; offset?: number }) =>
  http.get(ARTIST.songs, {
    params: {
      id,
      order: options?.order,
      limit: options?.limit,
      offset: options?.offset,
    },
  });

/**
 * 获取歌手单曲和部分信息
 * @param id 歌手ID
 */
export const getArtistInfo = (id: number) =>
  http
    .get<{ more: boolean; hotSongs: IrSongDetail[]; artist: IrArtistDetail }>(ARTIST.info, {
      params: { id },
    })
    .then(({ artist, hotSongs }) => ({
      artist: new MArtist(artist),
      songs: hotSongs.map((song) => new MSong(song)),
    }));

/**
 * 获取歌手MV
 * @param id 歌手ID
 */
export const getArtistMV = (id: number) =>
  http
    .get<{ hasMore: boolean; mvs: IrArtistMV[]; time: number }>(ARTIST.mv, {
      params: { id },
    })
    .then(({ mvs }) => ({ mv: mvs.map((mv) => new MArtistMV(mv)) }));

/**
 * 获取歌手专辑
 * @param id 歌手ID
 * @param limit 取出数量
 * @param offset 偏移位置
 */
export const getArtistAlbum = (id: number, limit?: number, offset?: number) =>
  http
    .get<{ artist: IrArtistDetail; hotAlbums: IrAlbumDetail[]; more: boolean }>(ARTIST.album, {
      params: { id, limit, offset },
    })
    .then(({ artist, hotAlbums }) => ({
      artist: new MArtist(artist),
      albums: hotAlbums.map((album) => new MAlbum(album)),
    }));

/**
 * 获取歌手描述
 * @param id 歌手ID
 */
export const getArtistDecs = (id: number) => http.get(ARTIST.decs, { params: { id } });

/**
 * 获取歌手详情
 * @param id 歌手ID
 */
export const getArtistDetail = (id: number) =>
  http
    .get<{
      data: {
        blacklist: boolean;
        showPriMsg: boolean;
        videoCount: number;
        artist: IrArtistDetail;
        eventCount?: number;
        identify?: { imageUrl: string; imageDesc: string; actionUrl: string };
        preferShow?: null;
        user?: IrUser;
        vipRights?: null;
      };
    }>(ARTIST.detail, {
      params: { id },
    })
    .then(({ data }) => data);
