/* eslint-disable @typescript-eslint/no-explicit-any */
import { createResponseInterceptor } from '@/utils/axios';
import type { AxiosResponse } from 'axios';

declare module 'axios' {
  interface Axios {
    request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T>;
    get<T = any, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    delete<T = any, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    head<T = any, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    options<T = any, D = any>(
      url: string,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    post<T = any, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    put<T = any, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    patch<T = any, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    postForm<T = any, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    putForm<T = any, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
    patchForm<T = any, D = any>(
      url: string,
      data?: D,
      config?: AxiosRequestConfig<D>,
    ): Promise<T>;
  }
}

// eslint-disable-next-line import/prefer-default-export
export const preprocessByResponse = <D, R = any>(
  processingFn: (data: D, response: AxiosResponse) => Promise<R>,
) =>
  createResponseInterceptor({
    resolve: (response) => {
      const { data, status } = response;

      if (status === 200) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return processingFn(data as D, response) as any;
      }

      return response;
    },
  });
