/* eslint-disable @typescript-eslint/no-explicit-any */
import { Artist, Album as HotAlbum } from './common';

type AvatarDetail = {
  userType: number;
  identityLevel: number;
  identityIconUrl: string;
};

type User = {
  backgroundUrl: string;
  birthday: number;
  detailDescription: string;
  authenticated: boolean;
  gender: number;
  city: number;
  signature: string;
  description: string;
  remarkName?: any;
  shortUserName: string;
  accountStatus: number;
  locationStatus: number;
  avatarImgId: number;
  defaultAvatar: boolean;
  province: number;
  nickname: string;
  expertTags?: any;
  djStatus: number;
  avatarUrl: string;
  accountType: number;
  authStatus: number;
  vipType: number;
  userName: string;
  followed: boolean;
  userId: number;
  lastLoginIP: string;
  lastLoginTime: number;
  authenticationTypes: number;
  mutual: boolean;
  createTime: number;
  anchor: boolean;
  authority: number;
  backgroundImgId: number;
  userType: number;
  experts?: any;
  avatarDetail: AvatarDetail;
};

type SecondaryExpertIdentiy = {
  expertIdentiyId: number;
  expertIdentiyName: string;
  expertIdentiyCount: number;
};

type Rank = {
  rank: number;
  type: number;
};

type ArtistDetail = {
  id: number;
  cover: string;
  avatar: string;
  name: string;
  transNames: string[];
  alias: any[];
  identities: string[];
  identifyTag: string[];
  briefDesc: string;
  rank: Rank;
  albumSize: number;
  musicSize: number;
  mvSize: number;
};

type Identify = {
  imageUrl: string;
  imageDesc: string;
  actionUrl: string;
};

type RightsInfoDetailDtoList = {
  vipCode: number;
  expireTime: number;
  iconUrl?: any;
  dynamicIconUrl?: any;
  vipLevel: number;
  signIap: boolean;
  signDeduct: boolean;
  signIapDeduct: boolean;
  sign: boolean;
};

type VipRights = {
  rightsInfoDetailDtoList: RightsInfoDetailDtoList[];
  oldProtocol: boolean;
  redVipAnnualCount: number;
  redVipLevel: number;
  now: number;
};

type ArtistDetailData = {
  videoCount: number;
  vipRights: VipRights;
  identify: Identify;
  artist: ArtistDetail;
  blacklist: boolean;
  preferShow: number;
  showPriMsg: boolean;
  secondaryExpertIdentiy: SecondaryExpertIdentiy[];
  eventCount: number;
  user: User;
};

export interface Album {
  artist: Artist;
  hotAlbums: HotAlbum[];
  more: boolean;
  code: number;
}

export interface Detail {
  code: number;
  message: string;
  data: ArtistDetailData;
}

export {};
