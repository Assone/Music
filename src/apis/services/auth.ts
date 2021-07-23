import { AUTH } from '@/config/path';
import http from '@/libs/http';
import { isString } from '@/utils';

/**
 * 登陆
 * @param account 要登陆的账号，可以是邮箱或者手机号码
 * @param password 密码
 */
export const login = (account: string | number, password: string): Promise<API.Auth.login> =>
  isString(account)
    ? http.post<API.Auth.login>(AUTH.loginEmail, { email: account, password })
    : http.post(AUTH.loginPhone, { phone: account, password });

/**
 * 登出
 */
export const logout = () => http.post(AUTH.logout);

/**
 * 获取登陆状态
 */
export const loginState = () => http.get(AUTH.status);

/**
 * 刷新登陆状态
 */
export const refresh = () => http.post(AUTH.refresh);

/**
 * 获取验证码
 * @param phone 手机号码
 * @param area 国家区号
 */
export const getCaptcha = (phone: number, area?: number) =>
  http.get(AUTH.captchaSend, { params: { phone, ctcode: area } });

/**
 * 验证验证码
 * @param phone 手机号码
 * @param captcha 验证码
 */
export const captchaVerify = (phone: number, captcha: string | number) =>
  http.post(AUTH.captchaVerify, { phone, captcha });

/**
 * 注册账号
 * @param phone 手机号码
 * @param password 密码
 * @param nickname 昵称
 * @param captcha 验证码
 */
export const register = (phone: number, password: string, nickname: string, captcha: number | string) =>
  http.post(AUTH.register, { phone, password, nickname, captcha });

/**
 * 修改密码
 * @param phone 手机号码
 * @param password 密码
 * @param nickname 昵称
 * @param captcha 验证码
 */
export const changePassword = (phone: number, password: string, nickname: string, captcha: number | string) =>
  http.post(AUTH.changePassword, { phone, password, nickname, captcha });

/**
 * 更棒手机号码，(流程:先发送验证码到原手机号码,再发送验证码到新手机号码然后再调用此接口)
 * @param oldCaptcha 原手机验证码
 * @param captcha 新手机验证码
 * @param phone 手机号码
 * @param area 国家区号
 */
export const changePhone = (oldCaptcha: number | string, captcha: number | string, phone: number, area?: number) =>
  http.post(AUTH.changePhone, {
    oldcaptcha: oldCaptcha,
    captcha,
    phone,
    ctcode: area,
  });

/**
 * 检查手机号码是否已注册
 * @param phone 手机号码
 * @param area 区号
 */
export const checkPhone = (phone: number, area?: number) =>
  http.head(AUTH.checkPhone, { params: { phone, countryCode: area } });

/**
 * 初始化昵称
 * @param nickname 昵称
 */
export const initNickname = (nickname: string) => http.post(AUTH.initNick, { nickname });
