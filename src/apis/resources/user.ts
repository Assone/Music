import http from '@/services/http';
import { from } from 'rxjs';
import { User } from '../path';

/**
 * 获取用户账号信息
 */
// eslint-disable-next-line import/prefer-default-export
export const getUserAccount = () =>
  from(http.get<API.User.Account>(User.account));
