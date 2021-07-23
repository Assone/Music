import { TypeIDMVArea, TypeIDMVOrder, TypeIDMVType } from '@/config/code';
import { MV } from '@/config/path';
import http from '@/libs/http';
import MMV from '@/models/MV';

/**
 * 获取所有MV
 * @param options 选项
 * @param options.area 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
 * @param options.type 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
 * @param options.order 排序,可选值为上升最快,最热,最新,不填则为上升最快
 * @param options.limit 取出数量 , 默认为 30
 * @param options.offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
 */
export const getMVAll = (options?: {
  area?: 0 | 1 | 2 | 3 | 4 | 5;
  type?: 0 | 1 | 2 | 3 | 4;
  order?: 0 | 1 | 2;
  limit?: number;
  offset?: number;
}) =>
  http.get(MV.all, {
    params: {
      area: options?.area && TypeIDMVArea[options?.area],
      type: options?.type && TypeIDMVType[options?.type],
      order: options?.order && TypeIDMVOrder[options.order],
      limit: options?.limit,
      offset: options?.offset,
    },
  });

/**
 *
 * @param options 选项
 * @param options.area 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
 * @param options.limit 取出数量 , 默认为 30
 */
export const getMVNew = (options?: { area?: 0 | 1 | 2 | 3 | 4 | 5; limit?: number }) =>
  http.get(MV.new, {
    params: { area: options?.area && TypeIDMVArea[options?.area], limit: options?.limit },
  });

/**
 * 获取网易出品mv
 * @param limit 取出数量 , 默认为 30
 * @param offset 偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认 为 0
 */
export const getMVOfficial = (limit?: number, offset?: number) =>
  http
    .get<{ more: boolean; data: IrMVDetail[] }>(MV.official, { params: { limit, offset } })
    .then(({ data }) => data.map((mv) => new MMV(mv)));

/**
 * 获取mv详情
 * @param id mv id
 */
export const getMVDetail = (id: number) =>
  http
    .get<{
      bufferPic: string;
      buferPicFS: string;
      loadingPic: string;
      loadingPicFS: string;
      subed: boolean;
      data: IrMVDetail;
      mp: {
        cp: number;
        dl: number;
        fee: number;
        id: number;
        msg: null | string;
        mvFee: number;
        normal: boolean;
        payed: number;
        pl: number;
        sid: number;
        st: number;
        unauthorized: boolean;
      };
    }>(MV.detail, { params: { mvid: id } })
    .then(({ data }) => new MMV(data));

/**
 * 获取mv信息
 * @param id mv id
 */
export const getMVInfo = (id: number) =>
  http.get<{ commentCount: number; liked: boolean; likedCount: number; shareCount: number }>(MV.info, {
    params: { mvid: id },
  });

/**
 * 获取mv播放地址
 * @param id mv id
 * @param resolution 分辨率,默认1080
 */
export const getMVUrl = (id: number, resolution?: number) =>
  http
    .get<{ data: IrGetMVUrl }>(MV.url, { params: { id, r: resolution } })
    .then(({ data: { url, r } }) => ({ url, resolution: r }));
