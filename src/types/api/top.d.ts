/* eslint-disable @typescript-eslint/no-explicit-any */
import { Artist, Video } from './common';

interface Mv {
  authId: number;
  status: number;
  id: number;
  title: string;
  subTitle: string;
  appTitle: string;
  aliaName: string;
  transName: string;
  pic4v3: number;
  pic16v9: number;
  caption: number;
  captionLanguage: string;
  style?: any;
  mottos: string;
  oneword?: any;
  appword: string;
  stars?: any;
  desc: string;
  area: string;
  type: string;
  subType: string;
  neteaseonly: number;
  upban: number;
  topWeeks: string;
  publishTime: string;
  online: number;
  score: number;
  plays: number;
  monthplays: number;
  weekplays: number;
  dayplays: number;
  fee: number;
  artists: Pick<Artist, 'id' | 'name'>[];
  videos: Video[];
}

export interface MvData {
  id: number;
  cover: string;
  name: string;
  playCount: number;
  briefDesc?: any;
  desc?: any;
  artistName: string;
  artistId: number;
  duration: number;
  mark: number;
  mv: Mv;
  lastRank: number;
  score: number;
  subed: boolean;
  artists: Artist[];
  alias?: string[];
}

export interface Mvs {
  code: number;
  data: MvData[];
  hasMore: boolean;
  updateTime: number;
}

export {};
