import http from '@/services/http';
import { formatSong } from '@/utils/format';
import { mapArray } from '@/utils/rxjs';
import { from, map } from 'rxjs';
import { Song } from '../path';

/**
 * 获取歌曲详情
 * @param ids 音乐ID
 */
export const getSongDetail = (ids: ID | ID[]) =>
  from(http.get<API.Song.Detail>(Song.detail, { params: { ids } })).pipe(
    map(({ songs }) => songs),
    mapArray(formatSong),
  );

/**
 * 歌曲质量
 * @description 从低到高
 */
export const enum SongQuality {
  standard = 'standard',
  higher = 'higher',
  exhigh = 'exhigh',
  lossless = 'lossless',
  hires = 'hires',
  jyeffect = 'jyeffect',
  sky = 'sky',
  jymaster = 'jymaster',
}

/**
 * 获取歌曲播放地址
 * @param id 音乐ID
 * @param quality 音质
 */
export const getSongUrl = (
  id: ID | ID[],
  quality: SongQuality = SongQuality.standard,
) =>
  from(
    http.get<API.Song.Url>(Song.url, { params: { id, level: quality } }),
  ).pipe(map(({ data }) => data));
