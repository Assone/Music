type PlaylistData = {
  id: number;
  type: number;
  name: string;
  copywriter: string;
  picUrl: string;
  canDislike: boolean;
  trackNumberUpdateTime: number;
  playCount: number;
  trackCount: number;
  highQuality: boolean;
  alg: string;
};

export interface Playlist {
  hasTaste: boolean;
  code: number;
  category: number;
  result: PlaylistData[];
}

export {};
