import axios from 'axios';
import { stringify } from 'qs';
import {
  logByRequest,
  logByResponse,
  preprocessByResponse,
} from './interceptors';

const http = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASEURL,
  paramsSerializer: (params) => stringify(params, { arrayFormat: 'comma' }),
});

interface ResponseData {
  code: number;
}

const interceptors = [
  logByRequest,
  logByResponse,
  preprocessByResponse<ResponseData>((data, response) => {
    if (data.code === 200) {
      return Promise.resolve(data);
    }

    return Promise.reject(response);
  }),
];

interceptors.forEach((interceptor) => interceptor(http));

export default http;
