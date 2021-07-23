import { RADIO } from '@/config/path';
import http from '@/libs/http';

/**
 * 获取私人FM
 */
export const getRadioPrivate = () => http.get(RADIO.private);

/**
 * 把该音乐从私人 FM 中移除至垃圾桶
 * @param id 音乐ID
 */
export const removeSongToTrash = (id: number) => http.post(RADIO.trash, { id });

/**
 * 获取电台订阅者列表
 * @param id 电台ID
 * @param limit 返回数量
 * @param offset 偏移位置
 */
export const getRadioSubscriber = (id: number, limit?: number, offset?: Date) =>
  http.get(RADIO.subscriber, { params: { id, limit, time: offset } });

/**
 * 获取热门电台
 * @param limit 返回数量
 * @param offset 偏移位置
 */
export const getRadioHot = (limit?: number, offset?: number) => http.get(RADIO.hot, { params: { limit, offset } });

/**
 * 获取电台 - 类别热门电台
 * @param options 选项
 * @param options.limit 返回数量
 * @param options.offset 偏移位置
 * @param options.cateId 类别ID
 */
export const getRadioCategoryHot = (options?: { limit?: number; offset?: number; cateId?: number }) =>
  http.get(RADIO.hotToCategory, { params: options });

/**
 * 获取电台分类
 */
export const getRadioClassification = () => http.get(RADIO.classification);

/**
 * 获取电台分类推荐
 * @param type 电台类型
 */
export const getRadioClassificationRec = (type: number) =>
  http.get(RADIO.classificationRecommend, { params: { type } });

/**
 * 获取电台 - 付费精选
 * @param limit 返回数量
 * @param offset 偏移位置
 */
export const getRadioPaidPicks = (limit?: number, offset?: number) =>
  http.get(RADIO.paidPicks, { params: { limit, offset } });

/**
 * 获取非热门类型
 */
export const getRadioCategoryExcludeHot = () => http.get(RADIO.typeExcludeHot);

/**
 * 获取电台 - 推荐类型
 */
export const getRadioCategoryRec = () => http.get(RADIO.typeCommend);

/**
 * 获取电台 - 今日优选
 */
export const getRadioToDayPreferred = () => http.get(RADIO.todayPreferred);

/**
 * 获取电台 - 节目
 * @param rid 电台的ID
 * @param options 选项
 * @param options.limit 返回数量
 * @param options.offset 偏移位置
 * @param options.asc 排序方式,默认为 false (新 => 老 ) 设置 true 可改为 老 => 新
 */
export const getRadioProgram = (rid: number, options?: { limit?: number; offset?: number; asc?: boolean }) =>
  http.get(RADIO.program, {
    params: { rid, limit: options?.limit, offset: options?.offset, asc: options?.asc },
  });

/**
 * 获取电台详情
 * @param rid 电台ID
 */
export const getRadioDetail = (rid: number) => http.get(RADIO.detail, { params: { rid } });

/**
 * 获取电台节目详情
 * @param id 节目ID
 */
export const getRadioProgramDetail = (id: number) => http.get(RADIO.programDetail, { params: { id } });
