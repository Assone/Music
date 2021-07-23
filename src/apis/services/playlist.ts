import { PLAYLIST } from '@/config/path';
import http from '@/libs/http';
import MPlaylist from '@/models/Playlist';
import { isString } from '@/utils/is';

/**
 * 获取歌单分类
 */
export const getPlaylistCategory = () => http.get(PLAYLIST.classification);

/**
 * 获取热门歌单分类
 */
export const getPlaylistCategoryHot = () => http.get(PLAYLIST.classificationHot);

/**
 * 获取歌单
 * @param type 歌单类型
 * @param options 选项
 * @param options.tag 歌单标签
 * @param options.limit 歌单数量
 * @param options.offset 偏移位置
 */
export const getPlaylist = (type?: 'new' | 'hot', options?: { tag?: string; limit?: number; offset?: number }) =>
  http
    .get<API.Playlist.index>(PLAYLIST.index, {
      params: {
        order: type,
        cat: options?.tag,
        limit: options?.limit,
        offset: options?.offset,
      },
    })
    .then(({ more, cat, playlists, total }) => ({
      more,
      cat,
      total,
      playlists: playlists.map((item) => new MPlaylist(item)),
    }));

/**
 * 获取歌单标签
 */
export const getPlaylistTags = () => http.get(PLAYLIST.tags);

/**
 * 获取精品歌单
 * @param tag 歌单标签
 * @param limit 歌单数量
 * @param offset 分页参数，上一页的最后一个歌单的 updateTime
 */
export const getPlaylistBoutique = (tag?: string, limit?: number, offset?: Date) =>
  http.get(PLAYLIST.boutique, {
    params: {
      cat: tag,
      limit,
      before: offset,
    },
  });

/**
 * 获取相关歌单推荐
 * @param id 歌单ID
 */
export const getPlaylistRecommend = (id: number) => http.get(PLAYLIST.recommend, { params: { id } });

/**
 * 获取歌单详情
 * @param id 歌单ID
 */
export const getPlaylistDetail = (id: number) =>
  http
    .get<{
      playlist: IrPlaylistDetail;
      privileges: IrTrack[];
      relatedVideos: null;
      urls: null;
    }>(PLAYLIST.detail, { params: { id } })
    .then(({ playlist }) => new MPlaylist(playlist));

/**
 * 获取歌单详情动态
 * @param id 歌单ID
 */
export const getPlaylistDynamic = (id: number) => http.get(PLAYLIST.detailDynamic, { params: { id } });

/**
 * 获取歌单收藏者
 * @param id 歌单ID
 * @param limit 收藏者数量
 * @param offset 偏移位置
 */
export const getPlaylistCollectors = (id: number, limit?: number, offset?: number) =>
  http.get(PLAYLIST.collectors, { params: { id, limit, offset } });

/**
 * 获取歌词
 * @param id 音乐id
 */
export const getLyric = (id: number) => http.get(PLAYLIST.lyric, { params: { id } });

/**
 * 更新歌单
 * @param id 歌单id
 * @param name 歌单名字
 * @param desc 歌单描述
 * @param tags 歌单tag
 */
export const updatePlaylist = (id: number, name: string, desc: string, tags: string | string[]) =>
  http.put(PLAYLIST.update, {
    id,
    name,
    desc,
    tags: isString(tags) ? tags : tags.join(';'),
  });

/**
 * 更新歌单名
 * @param id 歌单id
 * @param name 歌单名称
 */
export const updatePlaylistName = (id: number, name: string) => http.put(PLAYLIST.updateName, { id, name });

/**
 * 更新歌单描述
 * @param id 歌单id
 * @param desc 歌单描述
 */
export const updatePlaylistDesc = (id: number, desc: string) => http.put(PLAYLIST.updateDecs, { id, desc });

/**
 * 更新歌单tag
 * @param id 歌单id
 * @param tags 歌单tag
 */
export const updatePlaylistTags = (id: number, tags: string | string[]) =>
  http.put(PLAYLIST.updateTags, {
    id,
    tags: isString(tags) ? tags : tags.join(';'),
  });

/**
 * 更新歌单封面
 * @param id 歌单id
 * @param cover 封面
 * @param size 封面尺寸
 * @param offset 裁剪属性
 * @param offset.x 水平裁剪偏移
 * @param offset.y 垂直裁剪偏移
 */
export const updatePlaylistCover = (id: number, cover: FormData, size?: number, offset?: { x?: number; y?: number }) =>
  http.put(PLAYLIST.updateCover, {
    id,
    imgFile: cover,
    imgSize: size,
    imgX: offset?.x,
    imgY: offset?.y,
  });

/**
 * 更新歌单顺序
 * @param ids 歌单id列表
 */
export const updatePlaylistOrder = (ids: number[]) => http.put(PLAYLIST.updateOrder, { ids });
