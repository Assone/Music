/* eslint-disable no-console */

import {
  createRequestInterceptor,
  createResponseInterceptor,
} from '@/utils/axios';
import { AxiosError } from 'axios';

export const logByRequest = createRequestInterceptor<unknown, { time: number }>(
  {
    resolve: (config) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { method, url, data, params } = config;

      console.groupCollapsed(
        `%c${method?.toUpperCase()} %c${url} -->`,
        'color: #00aaff',
        'color: inherit',
      );

      if (data) {
        console.log('%cdata', 'color: #00aaff', data);
      }

      if (params) {
        console.log('%cparams', 'color: #00aaff', params);
      }

      console.groupEnd();

      // eslint-disable-next-line no-param-reassign
      config.time = Date.now();

      return config;
    },
  },
);

export const logByResponse = createResponseInterceptor<
  unknown,
  { time: number }
>({
  resolve: (response) => {
    const { config, data, headers, status, statusText } = response;
    const timeout = Date.now() - config.time;

    console.groupCollapsed(
      `%c${config.method?.toUpperCase()} %c${config.url} <-- ${timeout}ms`,
      'color: #00aaff',
      'color: inherit',
    );

    if (headers) {
      console.log('%cheaders', 'color: #00aaff', headers);
    }

    console.log('%cstatus', 'color: #00aaff', `${status} ${statusText}`);

    console.log('%cresponse', 'color: #00aaff', data);

    console.groupEnd();

    // console.timeEnd(`[${config.method?.toUpperCase()}] ${config.url}`)

    return response;
  },
  reject: (error: AxiosError) => {
    const { config, response } = error;

    console.groupCollapsed(
      `%c${config?.method?.toUpperCase()} %c${config?.url} <--`,
      'color: #00aaff',
      'color: inherit',
    );

    console.log('%cerror', 'color: #00aaff', response?.data);

    console.groupEnd();

    return Promise.reject(error);
  },
});
