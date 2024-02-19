import http from '@/services/http';
import { Mv } from '../path';

/**
 * 获取MV播放地址
 * @param id MV ID
 * @param resolution 分辨率
 */
// eslint-disable-next-line import/prefer-default-export
export const getMvUrl = (id: ID, resolution?: number) =>
  from(http.get<API.Mv.Url>(Mv.url, { params: { id, r: resolution } })).pipe(
    map((res) => res.data),
  );
