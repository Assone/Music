import { AxiosAdapter, AxiosRequestConfig, AxiosPromise } from 'axios';

import Cache from '@/models/tools/Cache';
import useCache from './cache';

const adapterEnhancer = (
  adapter: AxiosAdapter,
  adapterConfig: HTTP.AdapterConfig = { cache: false, maxAge: 5000 },
  cacheLike: HTTP.RequestConfig['cacheLike'] = Cache
) => {
  return (config: HTTP.RequestConfig<AxiosRequestConfig>): AxiosPromise<unknown> => {
    const { method, cache: enableCache } = config;

    if (method?.toUpperCase() === 'GET') {
      /**
       * 1. enabled default cache
       * 2. disabled default cache, but request set cache enable
       * 3. enabled default cache, but also request set cache not disabled
       */
      if (adapterConfig.cache || enableCache || (adapterConfig.cache && enableCache))
        return useCache({ config, adapter, adapterConfig, instance: cacheLike });
    }

    return adapter(config);
  };
};

export default adapterEnhancer;
