type UrlData = {
  id: number;
  url: string;
  r: number;
  size: number;
  md5: string;
  code: number;
  expi: number;
  fee: number;
  mvFee: number;
  st: number;
  promotionVo?: unknown;
  msg: string;
};

export interface Url {
  code: number;
  data: UrlData;
}

export {};
