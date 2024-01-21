/* eslint-disable @typescript-eslint/no-explicit-any */
import { Artist, Creator, Album as HotAlbum, Song } from './common';

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

type MvArtist = {
  img1v1Id: number;
  topicPerson: number;
  alias: any[];
  picUrl: string;
  briefDesc: string;
  picId: number;
  img1v1Url: string;
  albumSize: number;
  trans: string;
  musicSize: number;
  name: string;
  id: number;
  img1v1Id_str: string;
};

type Mv = {
  id: number;
  name: string;
  status: number;
  imgurl: string;
  artistName: string;
  artist: MvArtist;
  imgurl16v9: string;
  duration: number;
  playCount: number;
  publishTime: string;
  subed: boolean;
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

export interface MV {
  mvs: Mv[];
  time: number;
  hasMore: boolean;
  code: number;
}

export interface Songs {
  artist: Artist;
  hotSongs: Song[];
  more: boolean;
  code: number;
}

interface Content {
  type: number;
  id: number;
  content?: string;
}

interface Introduction {
  ti: string;
  txt: string;
}

interface Topic {
  id: number;
  addTime: number;
  mainTitle: string;
  title: string;
  content: Content[];
  userId: number;
  cover: number;
  headPic: number;
  shareContent: string;
  wxTitle: string;
  showComment: boolean;
  status: number;
  seriesId: number;
  pubTime: number;
  readCount: number;
  tags: string[];
  pubImmidiatly: boolean;
  auditor: string;
  auditTime: number;
  auditStatus: number;
  startText: string;
  delReason: string;
  showRelated: boolean;
  fromBackend: boolean;
  rectanglePic: number;
  updateTime: number;
  reward: boolean;
  summary: string;
  memo?: any;
  adInfo: string;
  categoryId: number;
  hotScore: number;
  recomdTitle: string;
  recomdContent: string;
  number: number;
}

interface TopicDatum {
  topic: Topic;
  creator: Creator;
  shareCount: number;
  commentCount: number;
  likedCount: number;
  liked: boolean;
  rewardCount: number;
  rewardMoney: number;
  relatedResource?: any;
  rectanglePicUrl: string;
  coverUrl: string;
  categoryId: number;
  categoryName: string;
  mainTitle: string;
  commentThreadId: string;
  reward: boolean;
  shareContent: string;
  wxTitle: string;
  addTime: number;
  seriesId: number;
  showComment: boolean;
  showRelated: boolean;
  memo?: any;
  summary: string;
  recmdTitle: string;
  recmdContent: string;
  readCount: number;
  url: string;
  title: string;
  tags: string[];
  id: number;
  number: number;
}

export interface Description {
  introduction: Introduction[];
  briefDesc: string;
  count: number;
  topicData: TopicDatum[];
  code: number;
}

export {};
