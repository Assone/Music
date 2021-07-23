import { NOTICE, MESSAGE } from '@/config/path';
import { isNumber } from '@/utils/is';
import http from '@/libs/http';

// !: 分页参数？？？
/**
 * 获取评论通知
 * @param limit 返回数量
 * @param offset 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
 */
export const getNoticeOfComment = (limit: number, offset?: Date) =>
  http.get(NOTICE.comment, { params: { limit, before: offset } });

/**
 * 获取 @ 我 通知
 * @param limit 返回数量
 * @param offset 偏移位置
 */
export const getNoticeOfMe = (limit: number, offset?: number) => http.get(NOTICE.toMe, { params: { limit, offset } });

/**
 * 获取通知
 * @param limit 返回数量
 * @param offset 返回数据的 time ,默认-1,传入上一次返回结果的 time,将会返回下一页的数据
 */
export const getNotice = (limit: number, offset: Date) =>
  http.get(NOTICE.index, { params: { limit, lasttime: offset } });

/**
 * 获取私信
 * @param limit 返回数量
 * @param offset 偏移位置
 */
export const getMessage = (limit?: number, offset?: number) => http.get(MESSAGE.get, { params: { limit, offset } });

/**
 * 发送私信
 * @param uid 户 id,多个传数组
 * @param content 要发送的内容
 */
export const sendMessage = (uid: number | number[], content: string) =>
  http.post(MESSAGE.send, { user_ids: isNumber(uid) ? uid : uid.join(','), msg: content });

/**
 * 发送私信音乐
 * @param uid 户 id,多个传数组
 * @param id 音乐id
 * @param content 要发送的内容
 */
export const sendMessageOfMusic = (uid: number | number[], id: number, content: string) =>
  http.post(MESSAGE.sendMusic, { user_ids: isNumber(uid) ? uid : uid.join(','), msg: content, id });

/**
 * 发送私信歌单
 * @param uid 户 id,多个传数组
 * @param id 歌单id
 * @param content 要发送的内容
 */
export const sendMessageOfPlaylist = (uid: number | number[], id: number, content: string) =>
  http.post(MESSAGE.sendPlaylist, {
    user_ids: isNumber(uid) ? uid : uid.join(','),
    msg: content,
    playlist: id,
  });

/**
 * 获取最近联系人
 */
export const getMessageRecent = () => http.get(MESSAGE.recent);

/**
 * 获取私信内容
 * @param uid 用户id
 * @param limit 返回数量
 * @param before 分页参数,取上一页最后一项的 time 获取下一页数据
 */
export const getMessageDetail = (uid: number, limit?: number, before?: Date) =>
  http.get(MESSAGE.detail, { params: { uid, limit, before } });
