/* eslint-disable @typescript-eslint/no-explicit-any */
import { Song } from './common';

type SearchResourceResult = {
  searchQcReminder?: any;
  songs: Song[];
  songCount: number;
};

export interface SearchResource {
  result: SearchResourceResult;
  code: number;
}

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
