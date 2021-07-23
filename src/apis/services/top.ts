import { TypeIDMVArea } from '@/config/code';
import { TOP } from '@/config/path';
import http from '@/libs/http';
import { getPlaylistDetail } from './playlist';

// /**
//  * 获取热门话题
//  * @param limit 取出数量
//  * @param offset 偏移位置
//  */
// export const getTopic = (limit?: number, offset?: number) =>
//   http.get(TOP.topic, { params: { limit, offset } });

/**
 * 获取新歌速递
 * @param type 地区类型
 */
export const getTopSong = (type: 0 | 7 | 8 | 16 | 96) => http.get(TOP.song, { params: { type } });

/**
 * 获取新碟上架
 * @param options 选项
 * @param options.limit: 取出数量 , 默认为 50
 * @param options.offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
 * @param options.area: ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 * @param options.type : new:全部 hot:热门,默认为 new
 * @param options.year : 年,默认本年
 * @param options.month : 月,默认本月
 */
export const getTopAlbum = (options?: {
  limit?: number;
  offset?: number;
  area?: 'ALL' | 'ZH' | 'EA' | 'KR' | 'JP';
  type?: 'new' | 'hot';
  year?: number;
  month?: number;
}) => http.get(TOP.album, { params: options });

/**
 * 获取歌手排行榜
 * @param type 地区类型
 * 1: 华语
 * 2: 欧美
 * 3: 韩国
 * 4: 日本
 */
export const getTopArtist = (type: 1 | 2 | 3 | 4) => http.get(TOP.artist, { params: { type } });

/**
 * 获取热门歌手
 * @param limit 取出数量
 * @param offset 偏移位置
 */
export const getTopArtistsHot = (limit?: number, offset?: number) =>
  http.get(TOP.artistHot, { params: { limit, offset } });

/**
 * 获取所有榜单
 */
export const getTopAll = () => http.get(TOP.all);

/**
 * 获取排行榜详情
 * @param id 要查询详情的id
 */
export const getTopDetail = (id: number) => getPlaylistDetail(id);

/**
 * 获取所有榜单内容摘要
 */
export const getTopAllAbstract = () => http.get(TOP.allAbstract);

/**
 * 获取mv排行
 * @param options 选项
 * @param options.limit: 取出数量 , 默认为 30
 * @param options.area: 地区,可选值为内地,港台,欧美,日本,韩国,不填则为全部
 * @param options.offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认 为 0
 */
export const getTopMV = (options?: { limit?: number; area?: 0 | 1 | 2 | 3 | 4 | 5; offset?: number }) =>
  http.get(TOP.mv, {
    params: {
      limit: options?.limit,
      offset: options?.offset,
      area: options?.area && TypeIDMVArea[options.area],
    },
  });

/**
 * 获取数字专辑&数字单曲-榜单
 * @param options 选项
 * @param options.limit 返回数量
 * @param options.offset 偏移位置
 * @param options.albumType 专辑类型
 * @param options.type 榜单类型
 */
export const getTopDigitalAlbum = (options?: {
  limit?: number;
  offset?: number;
  albumType?: 0 | 1;
  type: 'daily' | 'week' | 'year' | 'total';
}) => http.get(TOP.digital, { params: options });

/**
 * 获取电台节目榜
 * @param limit 返回数量
 * @param offset 偏移位置
 */
export const getTopProgram = (limit?: number, offset?: number) => http.get(TOP.program, { params: { limit, offset } });

/**
 * 获取付费精品电台
 * @param limit 返回数量
 */
export const getTopRadioPay = (limit?: number) => http.get(TOP.radioPay, { params: { limit } });

/**
 * 电台 - 24小时节目榜
 * @param limit 返回数量
 */
export const getTopProgram24H = (limit?: number) => http.get(TOP.program24, { params: { limit } });

/**
 * 获取电台 - 24小时主播榜
 * @param limit 返回数量
 */
export const getTopAnchor24H = (limit?: number) => http.get(TOP.anchor24, { params: { limit } });

/**
 * 电台 - 主播新人榜
 * @param limit 返回数量
 */
export const getTopAnchorNew = (limit?: number) => http.get(TOP.anchorNew, { params: { limit } });

/**
 * 电台 - 最热主播榜
 * @param limit 返回数量
 */
export const getTopAnchorHot = (limit?: number) => http.get(TOP.anchorHot, { params: { limit } });

/**
 * 电台 - 新晋电台榜/热门电台榜
 * @param options 选项
 * @param options.limit 返回数量 , 默认为 100
 * @param options.offset 偏移数量，用于分页 , 如 :( 页数 -1)*100, 其中 100 为 limit 的值 , 默认为 0
 * @param options.type 榜单类型, new 为新晋电台榜,hot为热门电台榜
 */
export const getTopRadio = (options?: { limit?: number; offset?: number; type?: 'new' | 'hot' }) =>
  http.get(TOP.radio, { params: options });
