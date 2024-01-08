/* eslint-disable @typescript-eslint/no-explicit-any */
import { Artist, Playlist, Song, User } from './common';

interface SearchPlaylist
  extends Pick<
    Playlist,
    | 'id'
    | 'name'
    | 'coverImgUrl'
    | 'subscribed'
    | 'trackCount'
    | 'userId'
    | 'playCount'
    | 'specialType'
    | 'score'
    | 'description'
    | 'highQuality'
  > {
  creator: Pick<
    User,
    | 'nickname'
    | 'userId'
    | 'userType'
    | 'avatarUrl'
    | 'authStatus'
    | 'expertTags'
    | 'experts'
  >;
  bookCount: number;
  officialTags?: any;
  action?: any;
  actionType?: any;
  recommendText?: any;
}

type SearchArtistResult = {
  artists: Artist[];
  artistCount: number;
};

type SearchSongResult = {
  songs: Song[];
  songCount: number;
};

type SearchPlaylistResult = {
  playlists: Playlist[];
  playlistCount: number;
};

type SearchResourceResult = {
  searchQcReminder?: any;
} & Partial<SearchArtistResult & SearchSongResult & SearchPlaylistResult>;

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
