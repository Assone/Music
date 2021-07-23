import { DYNAMIC } from '@/config/path';
import http from '@/libs/http';

type shareDynamicType = 'song' | 'playlist' | 'mv' | 'radio' | 'program';

const translationToShareType = (type: shareDynamicType | undefined) => {
  switch (type) {
    case 'radio':
      return 'djradio';
    case 'program':
      return 'djprogram';
    default:
      return type;
  }
};

/**
 * 分享资源到动态
 * @param id 资源id
 * @param options 分享选项
 */
export const shareToDynamic = (
  id: number,
  options?: {
    type?: shareDynamicType;
    content?: string;
  }
) =>
  http.post(DYNAMIC.share, {
    id,
    msg: options?.content,
    type: translationToShareType(options?.type),
  });

/**
 * 获取动态信息
 * @param limit 取出数量
 * @param offset 偏移位置， 返回数据的 lasttime ,默认-1,传入上一次返回结果的 lasttime,将会返回下一页的数据
 */
export const getDynamic = (limit?: number, offset?: Date) =>
  http.get(DYNAMIC.index, { params: { pagesize: limit, lasttime: offset } });

/**
 * 转发用户动态
 * @param uid 用户id
 * @param dynamicId 动态id
 * @param content 转发到内容
 */
export const forwardDynamic = (uid: number, dynamicId: number, content: string) =>
  http.post(DYNAMIC.forward, { uid, evId: dynamicId, forwards: content });

/**
 * 删除用户动态
 * @param dynamicId 动态id
 */
export const deleteDynamic = (dynamicId: number) => http.delete(DYNAMIC.delete, { params: { evId: dynamicId } });
