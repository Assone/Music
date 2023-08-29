import { Privilege, Song } from './common';

export interface Detail {
  songs: Song[];
  privileges: Privilege[];
  code: number;
}

export {};
