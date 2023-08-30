import { AxiosRequestConfig } from 'axios';

export type RequestConfig = Partial<Pick<AxiosRequestConfig, 'signal'>>;
