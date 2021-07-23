import { CLOUD_DISK } from '@/config/path';
import http from '@/libs/http';
import { isNumber } from '@/utils';

/**
 * 获取云盘数据
 * @param limit 返回数量
 * @param offset 偏移位置
 */
export const getCloudDiskData = (limit?: number, offset?: number) =>
  http.get(CLOUD_DISK.data, { params: { limit, offset } });

/**
 * 获取云盘数据详情
 * @param id 歌曲id
 */
export const getCloudDiskDataDetail = (id: number | number[]) =>
  http.get(CLOUD_DISK.dataDetail, {
    params: { id: isNumber(id) ? id : id.join(',') },
  });

/**
 * 删除云盘歌曲
 * @param id 歌曲id
 */
export const deleteCloudDiskSong = (id: number | number[]) =>
  http.delete(CLOUD_DISK.delSong, {
    params: { id: isNumber(id) ? id : id.join(',') },
  });
