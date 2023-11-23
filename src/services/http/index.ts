import axios from 'axios';
import { stringify } from 'qs';
import {
  logByRequest,
  logByResponse,
  preprocessByResponse,
} from './interceptors';
import { errorByResponse } from './interceptors/error';

const baseURL = import.meta.env.DEV
  ? `${import.meta.env.SSR ? `http://localhost:${__PORT__}` : ''}${
      import.meta.env.VITE_APP_API_BASEURL
    }`
  : import.meta.env.VITE_APP_API_BASEURL;

const http = axios.create({
  baseURL,
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
  errorByResponse,
];

interceptors.forEach((interceptor) => interceptor(http));

export default http;
