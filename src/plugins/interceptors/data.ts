import { AxiosError } from 'axios';
import { setInterceptorsResponse } from '@/libs/http';

setInterceptorsResponse(
  (res) => {
    const { data, status } = res;
    // 状态码为200，有响应且响应的代码为200是返回resolve
    return status === 200 && data?.code === 200 ? Promise.resolve(data) : Promise.reject(res);
  },
  (error: AxiosError) => {
    // 响应错误时处理异常信息
    console.error(`Method: ${error.config?.method}, path: ${error.config?.url}. ${error.message}.`);
    throw error;
  }
);
