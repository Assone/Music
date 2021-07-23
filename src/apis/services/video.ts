import { VIDEO } from '@/config/path';
import http from '@/libs/http';

/**
 * 获取最近播放的视频
 */
export const getVideoRecentPlay = () => http.get(VIDEO.recent);

/**
 * 获取视频标签
 */
export const getVideoTags = () => http.get(VIDEO.tags);

/**
 * 获取视频分类列表
 */
export const getVideoList = () => http.get(VIDEO.classification);

/**
 * 获取视频标签/分类下的视频
 * @param id video group id
 * @param offset 偏移位置
 */
export const getVideoByTag = (id: string, offset?: number) => http.get(VIDEO.tagToGroup, { params: { id, offset } });

/**
 * 获取全部视频
 * @param offset 偏移位置
 */
export const getVideoListAll = (offset?: number) => http.get(VIDEO.all, { params: { offset } });

/**
 * 获取视频详情
 * @param id 视频ID
 */
export const getVideoDetail = (id: string) => http.get(VIDEO.detail, { params: { id } });

/**
 * 获取视频部分信息
 * @param id 视频ID
 */
export const getVideoInfo = (id: string) => http.get(VIDEO.info, { params: { vid: id } });

/**
 * 获取视频播放地址
 * @param id 视频ID
 */
export const getVideoUrl = (id: string) => http.get(VIDEO.url, { params: { id } });

/**
 * 获取相关视频
 * @param id 视频ID
 */
export const getVideoRelated = (id: string) => http.get(VIDEO.related, { params: { id } });
