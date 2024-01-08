/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FreeTimeTrialPrivilege,
  FreeTrialPrivilege,
  Privilege,
  Song,
} from './common';

type UrlData = {
  id: number;
  url: string;
  br: number;
  size: number;
  md5: string;
  code: number;
  expi: number;
  type: string;
  gain: number;
  peak: number;
  fee: number;
  uf?: any;
  payed: number;
  flag: number;
  canExtend: boolean;
  freeTrialInfo?: any;
  level: string;
  encodeType: string;
  freeTrialPrivilege: FreeTrialPrivilege;
  freeTimeTrialPrivilege: FreeTimeTrialPrivilege;
  urlSource: number;
  rightSource: number;
  podcastCtrp?: any;
  effectTypes?: any;
  time: number;
};

export interface Url {
  data: UrlData[];
  code: number;
}

export interface Detail {
  songs: Song[];
  privileges: Privilege[];
  code: number;
}

export {};
