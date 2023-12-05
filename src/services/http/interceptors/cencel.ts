import {
  createRequestInterceptor,
  createResponseInterceptor,
} from '@/utils/axios';
import axios, { AxiosRequestConfig, Canceler } from 'axios';

// 请求队列
const requestPaddingMap = new Map<string, Canceler>();

const addRequestPadding = (key: string, canceler: Canceler) => {
  requestPaddingMap.set(key, canceler);
};

const removeRequestPadding = (key: string) => {
  requestPaddingMap.delete(key);
};

const getCancelKey = (config: AxiosRequestConfig) => {
  const { url, method } = config;
  return `${method}-${url}`;
};

const cancelRequest = (key: string) => {
  const canceler = requestPaddingMap.get(key);

  if (canceler) {
    canceler('cancel');
    removeRequestPadding(key);
  }
};

const getCancelToken = (key: string) =>
  new axios.CancelToken((canceler) => {
    addRequestPadding(key, canceler);
  });

export const cancelByRequest = createRequestInterceptor({
  resolve: (config) => {
    const key = getCancelKey(config);

    cancelRequest(key);
    const cancelToken = getCancelToken(key);

    return {
      ...config,
      cancelToken,
    };
  },
  reject: (error) => Promise.reject(error),
});

export const cancelByResponse = createResponseInterceptor({
  resolve: (response) => {
    const { config } = response;
    const key = getCancelKey(config);

    removeRequestPadding(key);

    return response;
  },
  reject: (error) => Promise.reject(error),
});
