import http from '@/services/http';
import { mapArray } from '@/utils/rxjs';
import { from, map } from 'rxjs';
import { Album } from '../path';

export enum AlbumListArea {
  zh = 'Z_H', // 华语
  ea = 'E_A', // 欧美
  kr = 'KR', // 韩国
  jp = 'JP', // 日本
}

interface AlbumListByStyleParams extends API.RequestArgs.PaginationOptions {
  area?: AlbumListArea;
}

/**
 * 根据风格获取专辑列表
 * @param params 查询参数
 */
export const getAlbumListByStyle = (params?: AlbumListByStyleParams) =>
  from(http.get<API.Album.ListByStyle>(Album.listByStyle, { params })).pipe(
    map((res) => res.albumProducts),
    mapArray(({ albumId, albumName, coverUrl }) => ({
      id: albumId,
      name: albumName,
      cover: coverUrl,
    })),
  );

/**
 * 获取专辑详情
 * @param id 专辑 id
 */
export const getAlbumDetail = (id: ID) =>
  from(http.get<API.Album.Detail>(Album.detail, { params: { id } })).pipe(
    map((res) => {
      const { name, id, picUrl: cover, publishTime, company } = res.album;
      const {
        id: artistId,
        name: artistName,
        picUrl: artistAvatar,
      } = res.album.artist;
      const artist = { id: artistId, name: artistName, avatar: artistAvatar };
      const songs = res.songs.map((song) => {
        const { id, name, dt: duration, mv: mvId, no } = song;

        return { id, name, duration, mvId, no };
      });
      const times = {
        publish: publishTime,
      };

      return { id, name, cover, artist, songs, times, company };
    }),
  );
