import { RECOMMEND } from '@/config/path';
import http from '@/libs/http';
import MRecPlaylist from '@/models/RecPlaylist';
import MMetaSource from '@/models/MetaSource';
import MRecMV from '@/models/RecMV';

/**
 * 获取每日推荐歌单
 */
export const getRecDailyPlaylist = () => http.get(RECOMMEND.dailyPlaylist);

/**
 * 获取每日推荐歌曲
 */
export const getRecDailySong = () => http.get(RECOMMEND.dailySong);

/**
 * 获取历史日推可用列表
 */
export const getRecDailyHistory = () => http.get(RECOMMEND.history);

/**
 * 获取历史日推详情数据
 * @param date 日期
 */
export const getRecDailyHistoryData = (date: Date) => http.get(RECOMMEND.historyDetail, { params: { date } });

/**
 * 获取推荐MV
 */
export const getRecMV = () =>
  http
    .get<{ category: number; result: IrRecMV[] }>(RECOMMEND.mv)
    .then(({ result }) => result.map((res) => new MRecMV(res)));

/**
 * 获取推荐歌单
 * @param limit 取出数量
 */
export const getRecPlaylist = (limit?: number) =>
  http
    .get<{ category: number; hasTaste: boolean; result: GetRecPlaylistResponse[] }>(RECOMMEND.playlist, {
      params: { limit },
    })
    .then(({ result }) => result.map((playlist) => new MRecPlaylist(playlist)));

/**
 * 获取推荐新音乐
 * @param limit 取出数量
 */
export const getRecSong = (limit?: number) =>
  http
    .get<{ category: number; result: (IrMetaSource & { song: IrRecSongDetail })[] }>(RECOMMEND.song, {
      params: { limit },
    })
    .then(({ result }) =>
      result.map((item) => {
        const {
          song: { artists },
        } = item;

        return {
          ...new MMetaSource(item),
          artists: artists.map((artist) => ({ id: artist.id, name: artist.name })),
        };
      })
    );

/**
 * 获取推荐电台
 */
export const getRecRadio = () => http.get(RECOMMEND.radio);

/**
 * 获取推荐节目
 */
export const getRecProgram = () => http.get(RECOMMEND.program);

/**
 * 获取推荐视频
 * @param offset 偏移位置
 */
export const getRecVideo = (offset?: number) => http.get(RECOMMEND.video, { params: { offset } });

/**
 * 获取电台个性推荐
 * @param limit 返回数量
 */
export const getRecRadioPersonal = (limit: number) => http.get(RECOMMEND.radioPersonal, { params: { limit } });
