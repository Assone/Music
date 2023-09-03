import http from '@/services/http';
import { from, map } from 'rxjs';
import { mapArray } from '@/utils/rxjs';
import { Search } from '../path';
import { RequestConfig } from '../type';

enum SearchType {
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

interface SearchOptions extends API.Common.PaginationOptions {
  type?: SearchType;
}

/**
 * 搜索
 * @param keywords 关键词
 * @param options 搜索选项
 * @param config 请求配置
 */
export const getSearchResource = (
  keywords: string,
  options?: SearchOptions,
  config?: RequestConfig,
) =>
  from(
    http.get(Search.resource, { params: { keywords, ...options }, ...config }),
  );

/**
 * 获取热搜列表
 * @param config 请求配置
 */
export const getSearchHotList = (config?: RequestConfig) =>
  from(http.get<API.Search.HotList>(Search.hot, config)).pipe(
    map((res) => res.data),
    mapArray((data) => ({
      keyword: data.searchWord,
    })),
  );
