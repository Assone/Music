import { USER } from '@/config/path';
import http from '@/libs/http';
import MPlaylist from '@/models/Playlist';
import MProfile from '@/models/Profile';

/**
 * 获取用户详情
 * @param uid 用户id
 */
export const getUserDetail = (uid: number) =>
  http.get<API.User.detail>(USER.detail, { params: { uid } }).then(({ profile }) => new MProfile(profile));

/**
 * 获取账号信息
 */
export const getAccountInfo = () => http.get(USER.infoAccount);

/**
 * 获取用户信息
 */
export const getUserInfo = () => http.get(USER.info);

/**
 * 获取用户等级信息
 */
export const getUserLevel = () => http.get(USER.level);

/**
 * 获取用户绑定信息
 * @param uid 用户id
 */
export const getBindInfo = (uid: number) => http.get(USER.infoBind, { params: { uid } });

/**
 * 更绑手机
 * @param oldCaptcha 原手机验证码
 * @param captcha 新手机验证码
 * @param phone 新手机号码
 * @param area 国家区号
 */
// export const changePhone = (
//   oldCaptcha: number | string,
//   captcha: number | string,
//   phone: number,
//   area?: number,
// ) => http.post(USER.changePhone, { oldcaptcha: oldCaptcha, captcha, phone, countrycode: area });

/**
 * 更新用户信息
 * @param info.gender 性别 0:保密 1:男性 2:女性
 * @param info.birthday 出生日期,时间戳 unix timestamp
 * @param info.province 省份id
 * @param info.city 城市id
 * @param info.nickname 昵称
 * @param info.signature 用户签名
 */
export const updateUserInfo = (info: {
  gender: 0 | 1 | 2;
  birthday: Date;
  province: number;
  city: number;
  nickname: string;
  signature: string;
}) => http.put(USER.updateInfo, info);

/**
 * 更新头像
 * @param image 图片， FormData
 * @param size 图片尺寸
 * @param offset 图片裁剪选项
 */
export const updateUserAvatar = (image: FormData, size?: number, offset?: { x?: number; y?: number }) =>
  http.put(USER.updateAvatar, {
    imgFile: image,
    imgSize: size,
    imgX: offset?.x,
    imgY: offset?.y,
  });

/**
 * 获取用户歌单
 * @param uid 用户id
 */
export const getUserPlaylist = (uid: number) =>
  http.get<API.User.playlist>(USER.playlist, { params: { uid } }).then(({ more, playlist }) => ({
    more,
    playlist: playlist.map((item) => new MPlaylist(item)),
  }));

/**
 * 获取用户电台
 * @param uid 用户id
 */
export const getUserRadio = (uid: number) => http.get(USER.radio, { params: { uid } });

/**
 * 获取用户关注列表
 * @param uid 用户id
 */
export const getUserFollowing = (uid: number) => http.get(USER.following, { params: { uid } });

/**
 * 获取用户粉丝列表
 * @param uid 用户id
 */
export const getUserFollowers = (uid: number) => http.get(USER.followers, { params: { uid } });

/**
 * 关注用户
 * @param id 用户id
 */
export const userFollow = (id: number) => http.post(USER.follow, { id, t: 1 });

/**
 * 取消关注用户
 * @param id 用户id
 */
export const userFollowCancel = (id: number) => http.post(USER.followCancel, { id, t: 0 });

/**
 * 获取用户播放记录
 * @param uid 用户id
 * @param type type=1 时只返回 weekData, type=0 时返回 allData
 */
export const getUserPlayRecord = (uid: number, type?: 0 | 1) => http.get(USER.record, { params: { uid, type } });

/**
 * 获取用户设置
 */
export const getUserSetting = () => http.get(USER.setting);

/**
 * 获取我的数字专辑
 */
export const getUserDigitalAlbum = () => http.get(USER.digitalAlbum);

/**
 * 购买数字专辑，说明 : 登录后调用此接口 ,可获取购买数字专辑的地址,把地址生成二维码后,可扫描购买专辑
 * @param id 专辑id
 * @param payment 支付方式， 0 为支付宝 3 为微信
 * @param quantity 购买的数量
 */
export const buyDigitalAlbum = (id: number, payment: 0 | 3, quantity: number) =>
  http.post(USER.digitalAlbumBuy, { id, payment, quantity });

/**
 * 获取用户动态
 * @param uid 用户id
 * @param limit 返回数量
 * @param offset 偏移位置
 */
export const getUserDynamic = (uid: number, limit?: number, offset?: Date) =>
  http.get(USER.dynamic, { params: { uid, limit, lasttime: offset } });

/**
 * 签到
 * @param type 签到类型 , 默认 0, 其中 0 为安卓端签到 ,1 为 web/PC 签到
 */
export const signIn = (type?: 0 | 1) => http.post(USER.signIn, { type });

/**
 * 听歌打卡
 * @param id 歌曲ID
 * @param sourceid 歌单或专辑ID
 * @param time 音乐播放时间
 */
export const clockIn = (id: number, sourceid: number, time?: number) => http.post(USER.clockIn, { id, sourceid, time });
