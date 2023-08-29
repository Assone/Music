/* eslint-disable @typescript-eslint/no-explicit-any */
import { Album, Song } from './common';

type AlbumListByStyleData = {
  albumId: number;
  albumName: string;
  artistName: string;
  artistNames: string[];
  price: number;
  customPriceConfig?: any;
  coverUrl: string;
  saleNum: number;
};

export interface ListByStyle {
  code: number;
  hasNextPage: boolean;
  albumProducts: AlbumListByStyleData[];
}

export interface Detail {
  resourceState: boolean;
  songs: Song[];
  code: number;
  album: Album;
}

export {};
