import http from '@/services/http';
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

// eslint-disable-next-line import/prefer-default-export
export const getSearchResource = (
  keywords: string,
  options?: SearchOptions,
  config?: RequestConfig,
) =>
  from(
    http.get(Search.resource, { params: { keywords, ...options }, ...config }),
  );
