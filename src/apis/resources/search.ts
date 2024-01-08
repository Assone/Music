import http, { type HttpRequestConfig } from "@/services/http";
import { formatArtist, formatPlaylistInfo, formatSong } from "@/utils/format";
import { mapArray } from "@/utils/rxjs";
import { from, map } from "rxjs";
import { Search } from "../path";

export enum SearchType {
  song = 1,
  album = 10,
  artist = 100,
  playlist = 1000,
  user = 1002,
  mv = 1004,
  lyric = 1006,
  radio = 1009,
  video = 1014,
  synthesis = 1018,
  sound = 2000,
}

interface SearchOptions extends API.RequestArgs.PaginationOptions {
  type?: SearchType;
}

/**
 * 搜索
 * @param keywords 关键词
 * @param options 搜索选项
 */
export const getSearchResource = (
  keywords: string,
  options?: SearchOptions,
  config?: HttpRequestConfig,
) =>
  from(
    http.get<API.Search.SearchResource>(Search.resource, {
      params: { keywords, ...options },
      ...config,
    }),
  ).pipe(
    map((res) => res.result),
    map((data) => ({
      songs: data.songs?.map(formatSong),
      playlists: data.playlists?.map(formatPlaylistInfo),
      artists: data.artists?.map(formatArtist),
    })),
  );

/**
 * 获取热搜列表
 * @param config 请求配置
 */
export const getSearchHotList = () =>
  from(http.get<API.Search.HotList>(Search.hot)).pipe(
    map((res) => res.data),
    mapArray((data) => ({
      keyword: data.searchWord,
    })),
  );
