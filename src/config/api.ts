import { AxiosRequestConfig } from 'axios';
import { isDev } from '@/utils/is';

const config: HTTP.Config<AxiosRequestConfig> = {
  timeout: 1000 * 60,
  baseURL: isDev ? '/api' : import.meta.env.VITE_APP_API_PROD,
  withCredentials: true,
  enhancer: {
    cache: true,
    maxAge: 10000,
  },
};

export default config;
