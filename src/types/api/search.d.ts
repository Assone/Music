export interface HotList {
  code: number;
  data: {
    searchWord: string;
    score: number;
    content: string;
    source: number;
    iconType: number;
    iconUrl?: string;
    url: string;
    alg: string;
  }[];
  message: string;
}

export {};
