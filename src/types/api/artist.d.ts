import { Artist, Album as HotAlbum } from './common';

export interface Album {
  artist: Artist;
  hotAlbums: HotAlbum[];
  more: boolean;
  code: number;
}

export interface Detail {
  name: string;
}

export {};
