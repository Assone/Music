import type {
  AxiosInstance,
  AxiosInterceptorOptions,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

interface Interceptors<V> {
  resolve?: (_value: V) => V | Promise<V>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject?: (_error: any) => any;
  options?: AxiosInterceptorOptions;
}

export const definedInterceptors =
  <T extends "request" | "response">(type: T) =>
  <D, E>(
    interceptors: Interceptors<
      T extends "request"
        ? InternalAxiosRequestConfig<D> & E
        : Omit<AxiosResponse<D>, "config"> & {
            config: InternalAxiosRequestConfig<D> & E;
          }
    >,
  ) =>
  (instance: AxiosInstance) => {
    const { resolve, reject, options } = interceptors;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    instance.interceptors[type].use(resolve, reject, options);
  };

export const createRequestInterceptor = definedInterceptors("request");
export const createResponseInterceptor = definedInterceptors("response");
