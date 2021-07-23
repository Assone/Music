import { COMMENT } from '@/config/path';
import http from '@/libs/http';

/**
 * 获取歌曲评论
 * @param id 音乐ID
 * @param limit 取出评论数量
 * @param offset 偏移位置
 */
export const getCommentSong = (id: number, limit?: number, offset?: number) =>
  http.get(COMMENT.song, {
    params: {
      id,
      limit,
      offset,
    },
  });

/**
 * 获取楼层评论
 * @param id 资源ID
 * @param type 资源类型，
 * 0: 歌曲
 * 1: mv
 * 2: 歌单
 * 3: 专辑
 * 4: 电台
 * 5: 视频
 * @param commentId 评论楼层id
 */
export const getCommentFloor = (id: number, type: 0 | 1 | 2 | 3 | 4 | 5, commentId: number) =>
  http.get(COMMENT.floor, { params: { id, type, parentCommentId: commentId } });

/**
 * 获取专辑评论
 * @param id 专辑ID
 * @param limit 评论数量
 * @param offset 偏移位置
 */
export const getCommentAlbum = (id: number, limit?: number, offset?: number) =>
  http.get(COMMENT.album, { params: { id, limit, offset } });

/**
 * 获取歌单评论
 * @param id 歌单ID
 * @param limit 评论数量
 * @param offset 偏移位置
 */
export const getCommentPlaylist = (id: number, limit?: number, offset?: number) =>
  http.get(COMMENT.playlist, { params: { id, limit, offset } });

/**
 * 获取 MV 评论
 * @param id MV id
 * @param limit 评论数量
 * @param offset 偏移位置
 */
export const getCommentMV = (id: number, limit?: number, offset?: number) =>
  http.get(COMMENT.mv, { params: { id, limit, offset } });

/**
 * 获取电台节目评论
 * @param id 电台id
 * @param limit 评论数量
 * @param offset 偏移位置
 */
export const getCommentRadio = (id: number, limit?: number, offset?: number) =>
  http.get(COMMENT.radio, { params: { id, limit, offset } });

/**
 * 获取视频评论
 * @param id 视频id
 * @param limit 评论数量
 * @param offset 偏移位置
 */
export const getCommentVideo = (id: number, limit?: number, offset?: number) =>
  http.get(COMMENT.video, { params: { id, limit, offset } });

/**
 * 获取热门评论
 * @param id 资源id
 * @param type 资源类型
 * 0: 歌曲
 * 1: mv
 * 2: 歌单
 * 3: 专辑
 * 4: 电台
 * 5: 视频
 * @param limit 评论数量
 * @param offset 偏移位置
 */
export const getCommentHot = (id: number, type: 0 | 1 | 2 | 3 | 4 | 5, limit?: number, offset?: number) =>
  http.get(COMMENT.hot, { params: { id, type, limit, offset } });

/**
 * 获取评论
 * @param id 资源id
 * @param type 资源类型
 * 0: 歌曲
 * 1: mv
 * 2: 歌单
 * 3: 专辑
 * 4: 电台
 * 5: 视频
 * 6: 动态
 * @param limit 评论数量
 * @param offset 偏移位置
 * @param sort 排序方式
 * @param cursor 当sort为3时且页数不为1时需传入，值为上一条数据的time
 */
export const getComment = (
  id: number,
  type: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  limit?: number,
  offset?: number,
  sort?: 1 | 2 | 3,
  cursor?: Date
) =>
  http.get(COMMENT.index, {
    params: { id, type, pageSize: limit, pageNo: offset, sortType: sort, cursor },
  });

/**
 * 获取动态评论
 * @param dynamicId 动态id
 */
export const getCommentDynamic = (dynamicId: number) => http.get(COMMENT.dynamic, { params: { threadId: dynamicId } });

/**
 * 抱一抱评论
 * @param userId 用户id
 * @param commentId 评论id
 * @param sourceId 资源id
 */
export const commentHug = (userId: number, commentId: number, sourceId: number) =>
  http.post(COMMENT.hug, { uid: userId, cid: commentId, sid: sourceId });

/**
 * 获取评论抱一抱列表
 * @param userId 用户id
 * @param commentId 评论id
 * @param sourceId 资源id
 * @param limit 页数
 * @param offset 偏移位置
 */
export const getCommentHugList = (
  userId: number,
  commentId: number,
  sourceId: number,
  limit?: number,
  offset?: number
) =>
  http.get(COMMENT.hugList, {
    params: {
      uid: userId,
      cid: commentId,
      sid: sourceId,
      pageSize: limit,
      page: offset,
    },
  });

/**
 * 发送评论
 * @param type 资源类型
 * 0: 歌曲
 * 1: mv
 * 2: 歌单
 * 3: 专辑
 * 4: 电台
 * 5: 视频
 * 6: 动态
 * @param content 要发送的内容
 * @param options 如给动态发送评论，则不需要传 id，需要传动态的 dynamicId
 * @param options.commentId 评论id
 * @param options.id 资源id
 * @param options.dynamicId 动态id
 */
export const sendComment = (
  type: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  content: string,
  options?: { id?: number; commentId?: number; dynamicId?: string }
) =>
  http.post(COMMENT.send, {
    t: 1,
    type,
    content,
    id: options?.id,
    commentId: options?.commentId,
    threadId: options?.dynamicId,
  });

/**
 * 删除评论
 * @param type 资源类型
 * 0: 歌曲
 * 1: mv
 * 2: 歌单
 * 3: 专辑
 * 4: 电台
 * 5: 视频
 * 6: 动态
 * @param options 如给动态删除评论，则不需要传 id，需要传动态的 dynamicId
 * @param options.commentId 评论id
 * @param options.id 资源id
 * @param options.dynamicId 动态id
 */
export const deleteComment = (
  type: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  options?: { id?: number; commentId?: number; dynamicId?: string }
) =>
  http.delete(COMMENT.delete, {
    params: {
      t: 0,
      type,
      id: options?.id,
      commentId: options?.commentId,
      threadId: options?.dynamicId,
    },
  });
