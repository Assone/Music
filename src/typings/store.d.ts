interface StoreStateRoot {
  account: null | { vipType: number };
}

interface StoreStateMedia {
  tracks: { id: number; type: 'audio' | 'video' | 'mv' }[];
  play: boolean;
  currentIndex: number;
}

type StoreStateConfig = IAppConfig;
type StoreState = StoreStateRoot & { config: StoreStateConfig; media: StoreStateMedia };
