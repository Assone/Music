import http from '@/services/http';
import { from } from 'rxjs';
import { Similar } from '../path';

/**
 * 获取相似歌手
 * @param id 歌手ID
 */
export const getSimilarArtist = (id: ID) =>
  from(http.get(Similar.artist, { params: { id } }));

/**
 * 获取相似歌单
 * @param id 歌曲ID
 */
export const getSimilarPlaylist = (id: ID) =>
  from(http.get(Similar.playlist, { params: { id } }));
