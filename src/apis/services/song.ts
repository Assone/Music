import { SONG } from '@/config/path';
import http from '@/libs/http';
import MSong from '@/models/Song';
import MTrack from '@/models/Track';
import MURLSong from '@/models/URLSong';
import { isNumber } from '@/utils/is';

/**
 * 调整歌曲顺序
 * @param id 歌单ID
 * @param tracks 歌曲ID列表
 */
export const updateSongOrder = (id: number, tracks: number[]) => http.put(SONG.updateOrder, { id, ids: tracks });

/**
 * 获取音乐URL
 * @param id 音乐ID
 * @param br 码率
 */
export const getSongUrl = (id: number | number[], br = 999000) =>
  http
    .get<{ data: IrGetSongURL[] }>(SONG.url, {
      params: { id: isNumber(id) ? id : id.join(','), br },
    })
    .then(({ data }) => data.map((song) => new MURLSong(song)));

/**
 * 检查音乐是否可用
 * @param id 歌曲ID
 * @param br 码率
 */
export const checkSongAvailable = (id: number, br?: number) => http.head(SONG.available, { params: { id, br } });

/**
 * 获取歌曲详情
 * @param ids 音乐ID
 */
export const getSongDetail = (ids: number | number[]) =>
  http
    .get<{ privileges: IrTrack[]; songs: IrSongDetail[] }>(SONG.detail, {
      params: { ids: isNumber(ids) ? ids : ids.join(',') },
    })
    .then(({ songs, privileges }) => ({
      songs: songs.map((song) => new MSong(song)),
      track: privileges.map((track) => new MTrack(track)),
    }));

/**
 * 获取关注歌手新歌
 * @param limit 取出评论数量
 * @param offset 上一页数据返回的publishTime的数据
 */
export const getSongNewBySubArtist = (limit?: number, offset?: Date) =>
  http.get(SONG.subArtistNewSong, { params: { limit, offset } });
