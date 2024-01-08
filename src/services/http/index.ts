import axios, { type AxiosRequestConfig } from "axios";
import { stringify } from "qs";
import { preprocessByResponse } from "./interceptors";

let baseURL = import.meta.env.VITE_APP_API_BASEURL;

if (import.meta.env.SSR && import.meta.env.DEV) {
  baseURL = `http://localhost:${__PORT__}${baseURL}`;
}

const http = axios.create({
  baseURL,
  paramsSerializer: (params) => stringify(params, { arrayFormat: "comma" }),
});

interface ResponseData {
  code: number;
}

const interceptors = [
  preprocessByResponse<ResponseData>((data, response) => {
    if (data.code === 200) {
      return Promise.resolve(data);
    }

    return Promise.reject(response);
  }),
];

interceptors.forEach((interceptor) => interceptor(http));

export type HttpRequestConfig = Omit<
  AxiosRequestConfig,
  "method" | "url" | "params"
>;

export default http;
