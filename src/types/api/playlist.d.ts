/* eslint-disable @typescript-eslint/no-explicit-any */
import { Playlist, Privilege } from './common';

export interface Detail {
  code: number;
  relatedVideos?: any;
  playlist: Playlist;
  urls?: any;
  privileges: Privilege[];
  sharedPrivilege?: any;
  resEntrance?: any;
  fromUsers?: any;
  fromUserCount: number;
  songFromUsers?: any;
  trialMode: number;
}

export {};
