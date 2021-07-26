import apiConfig from '@/config/api';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosAdapter } from 'axios';
import adapterEnhancer from './adapter';

export type HTTPCoreConfig = HTTP.Config<AxiosRequestConfig>;
export type HTTPRequestConfig = HTTP.RequestConfig<AxiosRequestConfig>;

class HTTPCore {
  instance: AxiosInstance;

  constructor(config: HTTPCoreConfig) {
    const adapter = adapterEnhancer(Axios.defaults.adapter as AxiosAdapter, config.enhancer);
    const coreConfig = config;
    delete coreConfig.enhancer;

    this.instance = Axios.create({
      ...coreConfig,
      adapter,
    });
  }

  static setInterceptorsRequest(
    core: HTTPCore,
    resolve: HTTP.InterceptorsRequest<AxiosRequestConfig>,
    reject: HTTP.InterceptorsResponse
  ) {
    core.instance.interceptors.request.use(resolve, reject);
  }

  static setInterceptorsResponse(
    core: HTTPCore,
    resolve: HTTP.InterceptorsRequest<AxiosResponse>,
    reject: HTTP.InterceptorsResponse
  ) {
    core.instance.interceptors.response.use(resolve, reject);
  }

  get<T = unknown>(url: string, config?: HTTPRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  delete<T = unknown>(url: string, config?: HTTPRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  head<T = unknown>(url: string, config?: HTTPRequestConfig): Promise<T> {
    return this.instance.head(url, config);
  }

  options<T = unknown>(url: string, config?: HTTPRequestConfig): Promise<T> {
    return this.instance.options(url, config);
  }

  post<T = unknown>(url: string, data?: Record<string, unknown>, config?: HTTPRequestConfig): Promise<T> {
    return this.instance.post(url, data, config);
  }

  put<T = unknown>(url: string, data?: Record<string, unknown>, config?: HTTPRequestConfig): Promise<T> {
    return this.instance.put(url, data, config);
  }

  patch<T = unknown>(url: string, data?: Record<string, unknown>, config?: HTTPRequestConfig): Promise<T> {
    return this.instance.patch(url, data, config);
  }
}

const http = new HTTPCore(apiConfig);

export const setInterceptorsRequest = (
  resolve: HTTP.InterceptorsRequest<HTTPRequestConfig>,
  reject: HTTP.InterceptorsResponse
): void => HTTPCore.setInterceptorsRequest(http, resolve, reject);

export const setInterceptorsResponse = (
  resolve: HTTP.InterceptorsRequest<AxiosResponse>,
  reject: HTTP.InterceptorsResponse
): void => HTTPCore.setInterceptorsResponse(http, resolve, reject);

export default http;
