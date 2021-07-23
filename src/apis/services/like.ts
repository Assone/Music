import { LIKE } from '@/config/path';
import http from '@/libs/http';

/**
 * 获取点赞过的视频
 */
export const getLikeVideoList = () => http.get(LIKE.listVideo);

/**
 * 获取喜欢音乐列表
 */
export const getLikeSongList = (uid: number) => http.get(LIKE.listSong, { params: { uid } });

/**
 * 评论点赞
 * @param id 资源id
 * @param commentId 评论id
 * @param type 资源类型
 * 0: 歌曲
 * 1: mv
 * 2: 歌单
 * 3: 专辑
 * 4: 电台
 * 5: 视频
 * 6: 动态
 */
export const likeComment = (id: number, commentId: number, type: 0 | 1 | 2 | 3 | 4 | 5 | 6) =>
  http.post(LIKE.comment, { id, cid: commentId, t: 1, type });

/**
 * 取消评论点赞
 * @param id 资源id
 * @param commentId 评论id
 * @param type 资源类型
 * 0: 歌曲
 * 1: mv
 * 2: 歌单
 * 3: 专辑
 * 4: 电台
 * 5: 视频
 * 6: 动态
 */
export const likeCommentCancel = (id: number, commentId: number, type: 0 | 1 | 2 | 3 | 4 | 5 | 6) =>
  http.post(LIKE.comment, { id, cid: commentId, t: 0, type });

/**
 * 资源点赞
 * @param id 资源id
 * @param type 资源类型
 * 1: mv
 * 4: 电台
 * 5: 视频
 * 6: 动态
 */
export const likeResource = (id: number, type: 1 | 4 | 5 | 6) => http.post(LIKE.resource, { id, t: 1, type });

/**
 * 资源点赞取消
 * @param id 资源id
 * @param type 资源类型
 * 1: mv
 * 4: 电台
 * 5: 视频
 * 6: 动态
 */
export const likeResourceCancel = (id: number, type: 1 | 4 | 5 | 6) => http.post(LIKE.resource, { id, t: 0, type });

/**
 * 喜欢音乐
 * @param id 歌曲id
 */
export const likeSong = (id: number) => http.post(LIKE.song, { id, like: true });

/**
 * 取消喜欢音乐
 * @param id 歌曲id
 */
export const likeSongCancel = (id: number) => http.post(LIKE.song, { id, like: false });
