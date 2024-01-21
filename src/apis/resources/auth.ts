import http from '@/services/http';
import { Auth } from '../path';

/**
 * 获取登录状态
 */
// eslint-disable-next-line import/prefer-default-export
export const getAuthLoginStatus = () =>
  from(http.get<API.Auth.LoginStatus>(Auth.loginStatus));
