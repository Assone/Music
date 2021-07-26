import { AxiosRequestConfig, AxiosAdapter, AxiosPromise } from 'axios';
// eslint-disable-next-line import/no-extraneous-dependencies
import { stringify } from 'qs';

const generateRequestKey = ({ method, url, params, data }: AxiosRequestConfig) =>
  [method, url, stringify(params), stringify(data)].join('&');

const useCache = (options: {
  config: HTTP.RequestConfig<AxiosRequestConfig>;
  instance: NonNullable<HTTP.RequestConfig['cacheLike']>;
  adapter: AxiosAdapter;
  adapterConfig: HTTP.AdapterConfig;
}): AxiosPromise<unknown> => {
  const { config, instance, adapter, adapterConfig } = options;
  const { cacheLike } = config;
  const cacheInstance = cacheLike || instance;

  const key = generateRequestKey(config);
  const cacheResponse = cacheInstance.get(key);

  if (!cacheResponse) {
    const response = (async () => {
      try {
        return await adapter(config);
      } catch (error) {
        cacheInstance.delete(key);
        return error;
      }
    })();

    cacheInstance.set(key, response, adapterConfig.maxAge);
    return response;
  }

  return Promise.resolve(cacheResponse) as AxiosPromise<unknown>;
};

export default useCache;
