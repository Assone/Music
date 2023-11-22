/* eslint-disable @typescript-eslint/no-explicit-any */

interface QualityInfo {
  br: number;
  fid: number;
  size: number;
  vd: number;
  sr?: number;
}

interface Al {
  id: number;
  name: string;
  picUrl: string;
  tns: any[];
  pic: number;
  pic_str?: string;
}

interface Ar {
  id: number;
  name: string;
  tns: any[];
  alias: any[];
}

interface AvatarDetail {
  userType: number;
  identityLevel: number;
  identityIconUrl: string;
}
export interface Artist {
  img1v1Id: number;
  topicPerson: number;
  musicSize: number;
  albumSize: number;
  briefDesc: string;
  alias: any[];
  picId: number;
  picUrl: string;
  img1v1Url: string;
  followed: boolean;
  trans: string;
  name: string;
  id: number;
  picId_str?: string;
  transNames?: string[];
  img1v1Id_str: string;
}

interface OriginSongSimpleDatum {
  songId: number;
  name: string;
  artists: Artist[];
  albumMeta: Artist;
}

export interface User {
  defaultAvatar: boolean;
  province: number;
  authStatus: number;
  followed: boolean;
  avatarUrl: string;
  accountStatus: number;
  gender: number;
  city: number;
  birthday: number;
  userId: number;
  userType: number;
  nickname: string;
  signature: string;
  description: string;
  detailDescription: string;
  avatarImgId: number;
  backgroundImgId: number;
  backgroundUrl: string;
  authority: number;
  mutual: boolean;
  expertTags?: string[];
  experts?: any;
  djStatus: number;
  vipType: number;
  remarkName?: any;
  authenticationTypes: number;
  avatarDetail?: AvatarDetail;
  avatarImgIdStr: string;
  backgroundImgIdStr: string;
  anchor: boolean;
  avatarImgId_str: string;
}

export interface Subscriber extends User {}

export interface Creator extends User {}

interface ChargeInfoList {
  rate: number;
  chargeUrl?: any;
  chargeMessage?: any;
  chargeType: number;
}

export interface FreeTrialPrivilege {
  resConsumable: boolean;
  userConsumable: boolean;
  listenType?: any;
  cannotListenReason?: any;
}

export interface FreeTimeTrialPrivilege {
  resConsumable: boolean;
  userConsumable: boolean;
  type: number;
  remainTime: number;
}

export interface Privilege {
  id: number;
  fee: number;
  payed: number;
  realPayed: number;
  st: number;
  pl: number;
  dl: number;
  sp: number;
  cp: number;
  subp: number;
  cs: boolean;
  maxbr: number;
  fl: number;
  pc?: any;
  toast: boolean;
  flag: number;
  paidBigBang: boolean;
  preSell: boolean;
  playMaxbr: number;
  downloadMaxbr: number;
  maxBrLevel: string;
  playMaxBrLevel: string;
  downloadMaxBrLevel: string;
  plLevel: string;
  dlLevel: string;
  flLevel: string;
  rscl?: any;
  freeTrialPrivilege: FreeTrialPrivilege;
  rightSource: number;
  chargeInfoList: ChargeInfoList[];
}

export interface TrackId {
  id: number;
  v: number;
  t: number;
  at: number;
  alg?: any;
  uid: number;
  rcmdReason: string;
  sc?: any;
  f?: any;
  sr?: any;
}

export interface Track {
  name: string;
  id: number;
  pst: number;
  t: number;
  ar: Ar[];
  alia: string[];
  pop: number;
  st: number;
  rt?: string;
  fee: number;
  v: number;
  crbt?: any;
  cf: string;
  al: Al;
  dt: number;
  h?: QualityInfo;
  m?: QualityInfo;
  l?: QualityInfo;
  sq?: QualityInfo;
  hr?: any;
  a?: any;
  cd: string;
  no: number;
  rtUrl?: any;
  ftype: number;
  rtUrls: any[];
  djId: number;
  copyright: number;
  s_id: number;
  mark: number;
  originCoverType: number;
  originSongSimpleData?: any;
  tagPicList?: any;
  resourceState: boolean;
  version: number;
  songJumpInfo?: any;
  entertainmentTags?: any;
  awardTags?: any;
  single: number;
  noCopyrightRcmd?: any;
  rtype: number;
  rurl?: any;
  mst: number;
  cp: number;
  mv: number;
  publishTime: number;
  tns?: string[];
}
interface Pc {
  nickname: string;
  fn: string;
  cid: string;
  uid: number;
  alb: string;
  br: number;
  ar: string;
  sn: string;
}

export type Playlist = {
  id: number;
  name: string;
  coverImgId: number;
  coverImgUrl: string;
  coverImgId_str: string;
  adType: number;
  userId: number;
  createTime: number;
  status: number;
  opRecommend: boolean;
  highQuality: boolean;
  newImported: boolean;
  updateTime: number;
  trackCount: number;
  specialType: number;
  privacy: number;
  trackUpdateTime: number;
  commentThreadId: string;
  playCount: number;
  trackNumberUpdateTime: number;
  subscribedCount: number;
  cloudTrackCount: number;
  ordered: boolean;
  description: string;
  tags: string[];
  updateFrequency?: any;
  backgroundCoverId: number;
  backgroundCoverUrl?: any;
  titleImage: number;
  titleImageUrl?: any;
  englishTitle?: any;
  officialPlaylistType?: any;
  copied: boolean;
  relateResType?: any;
  subscribers: Subscriber[];
  subscribed: boolean;
  creator: Creator;
  tracks: Track[];
  videoIds?: any;
  videos?: any;
  trackIds: TrackId[];
  bannedTrackIds?: any;
  mvResourceInfos?: any;
  shareCount: number;
  commentCount: number;
  remixVideo?: any;
  sharedUsers?: any;
  historySharedUsers?: any;
  gradeStatus: string;
  score?: any;
  algTags?: any;
};

export interface Song {
  name: string;
  id: number;
  pst: number;
  t: number;
  ar: Ar[];
  alia: string[];
  pop: number;
  st: number;
  rt?: string;
  fee: number;
  v: number;
  crbt?: any;
  cf: string;
  al: Al;
  dt: number;
  h?: QualityInfo;
  m?: QualityInfo;
  l?: QualityInfo;
  sq?: QualityInfo;
  hr?: QualityInfo;
  a?: any;
  cd: string;
  no: number;
  rtUrl?: any;
  ftype: number;
  rtUrls: any[];
  djId: number;
  copyright: number;
  s_id: number;
  mark: number;
  originCoverType: number;
  originSongSimpleData?: OriginSongSimpleDatum;
  tagPicList?: any;
  resourceState: boolean;
  version: number;
  songJumpInfo?: any;
  entertainmentTags?: any;
  awardTags?: any;
  single: number;
  noCopyrightRcmd?: any;
  cp: number;
  rtype: number;
  rurl?: any;
  mst: number;
  mv: number;
  publishTime: number;
  tns?: string[];
  pc?: Pc;
}

interface ResourceInfo {
  id: number;
  userId: number;
  name: string;
  imgUrl: string;
  creator?: any;
  encodedId?: any;
  subTitle?: any;
  webUrl?: any;
}

interface CommentThread {
  id: string;
  resourceInfo: ResourceInfo;
  resourceType: number;
  commentCount: number;
  likedCount: number;
  shareCount: number;
  hotCount: number;
  latestLikedUsers?: any;
  resourceTitle: string;
  resourceOwnerId: number;
  resourceId: number;
}

interface AlbumInfo {
  commentThread: CommentThread;
  latestLikedUsers?: any;
  liked: boolean;
  comments?: any;
  resourceType: number;
  resourceId: number;
  commentCount: number;
  likedCount: number;
  shareCount: number;
  threadId: string;
}

export interface Album {
  songs: any[];
  paid: boolean;
  onSale: boolean;
  mark: number;
  awardTags?: any;
  companyId: number;
  publishTime: number;
  company: string;
  briefDesc: string;
  alias: any[];
  artists: Artist[];
  copyrightId: number;
  picId: number;
  artist: Artist;
  pic: number;
  picUrl: string;
  commentThreadId: string;
  blurPicUrl: string;
  description: string;
  tags: string;
  status: number;
  subType: string;
  name: string;
  id: number;
  type: string;
  size: number;
  picId_str: string;
  info: AlbumInfo;
}
export {};
