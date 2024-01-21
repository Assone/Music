import { getSongDetail, getSongUrl } from '@/apis';
import { combineLatest, lastValueFrom, map } from 'rxjs';
import {
  assign,
  createMachine,
  fromPromise,
  log,
  type PromiseActorLogic,
} from 'xstate';

export enum TrackType {
  audio,
  video,
}

export interface TrackData {
  id: number;
  type: TrackType;
}

enum PlayerPlayMode {
  normal,
  single,
  random,
  loop,
}

type PlayerResourceMetaData = {
  id: number;
  name: string;
};

interface PlayerResourceArtistData extends PlayerResourceMetaData {}

interface PlayerResourceAlbumData extends PlayerResourceMetaData {}

interface PlayerResourceInformation {
  url: string;
  name: string;
  cover?: string;
  artist?: PlayerResourceArtistData;
  album?: PlayerResourceAlbumData;
}

export interface PlayerContext {
  mode: PlayerPlayMode;
  volume: number;
  mute: boolean;
  tracks: TrackData[];
  currentTrackIndex?: number;
  currentTrackResourceInformation?: PlayerResourceInformation;
}

type PlayerResourceEvent = { type: 'RETRY_LOAD' };

type PlayerControlEvent =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STOP' };

type PlayerVolumeEvent =
  | { type: 'SET_VOLUME'; volume: number }
  | { type: 'MUTE' }
  | { type: 'UNMUTE' };

type PlayerTrackEvent =
  | { type: 'SET_TRACKS'; tracks: TrackData[] }
  | { type: 'ADD_TRACK'; track: TrackData }
  | { type: 'REMOVE_TRACK'; track: TrackData }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' }
  | { type: 'SET_CURRENT_PLAY_TRACK'; track: TrackData };

type WindowControlEvent = { type: 'TOGGLE_FULLSCREEN' };

type PlayerEvents =
  | PlayerResourceEvent
  | PlayerControlEvent
  | PlayerVolumeEvent
  | PlayerTrackEvent
  | WindowControlEvent;

type PlayerActions =
  | { type: 'setVolume'; params: { volume: number } }
  | { type: 'setMute'; params: { mute: boolean } }
  | { type: 'setTracks'; params: { tracks: TrackData[] } }
  | { type: 'addTrack'; params: { track: TrackData } }
  | { type: 'removeTrack'; params: { track: TrackData } }
  | { type: 'nextTrack' }
  | { type: 'prevTrack' }
  | { type: 'setCurrentPlayTrack'; params: { track: TrackData } }
  | { type: 'initCurrentTrackIndex' }
  | { type: 'updateCurrentTrackResourceMediaMetadata' };

type PlayerActors = {
  src: 'loadTrack';
  logic: PromiseActorLogic<PlayerResourceInformation, TrackData | undefined>;
};

type PlayerGuards = { type: 'canNextTrack' } | { type: 'shouldStopPlay' };

const loadTrack = fromPromise<PlayerResourceInformation, TrackData | undefined>(
  async ({ input }) => {
    if (!input) return Promise.reject(new Error('No input'));

    const { id, type } = input;

    switch (type) {
      case TrackType.audio: {
        const data = combineLatest([getSongUrl(id), getSongDetail(id)]).pipe(
          map(([[url], [detail]]) => {
            const { name, album, artists } = detail!;
            const { cover } = album;
            const artist = artists[0];

            return {
              name,
              url: url!.url,
              cover,
              artist,
              album,
            };
          }),
        );

        return lastValueFrom(data);
      }

      default:
        return Promise.reject(new Error('Unknown track type'));
    }
  },
);

const playerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgYgGUBRAFQH0A1AeQBkBVAWSIG0AGAXURQHtYBLAC59uAOy4gAHogCMAZlYAmAHSsArABYA7KtYAOTQE4d66QBoQmRAtbqlB1gDYFO6awObd62ZoC+P82hYuHgMdCQsHOLIvILCYkiSMrLSukrOsgbS6vaqWbpmFjJ6Suqqyc5q6roGCil+ARjY+HQAcqHhbJwJ0fxCouJSCHIpSq4G6qUKzrqyM+aWQwr1IIFNhKRkJABKAIIAwgDSBJ1RMX3xoIOamvOIqvlKsqoGsg7SmuoKDjpL-iuNwR2ABEgZtdocTt0znEBklHGlZBMbNYFJp0rchtpNEpdKpDLUHK9FA5fH9VsEtkQGFQKEQwfsDpCeL0YQlBtIFPYSrpdJztNkHCSMdJBdISjYHLzWHJ7njluT8MRyHs6FtKS1yAAFGg7ACa9IhkShLP6bJkCnUDiUDiqOheNtyNWFqhtdlyEwUGWkWQm8oBOCUAFtIHx0EpYAJuMhkJA8Nq9UyVtDTZcZO5sbzdKxkl509oMdVUm9VCWqrJZmoHH6ggHgxBQ0pUNx0PWRFA8BBRGAlHwRAA3bgAa27CqDIbDTZbvagCF7A4Axuhzp1Ez1YinEkN0ziFFmcxlrvnCghtMps-Zdy7DLldNWmmP6xPm6327gcNwA4EBAAzD+BpSjnWDaTi+s79twi7Lhwq7Jhcm6euMSiGCSBiZAY3yaCKGKaNK1qeDM2alKh6h3rgD4Nm+H54JS2z6jQVDAjBJpwYMFrZjiBi4tmLqOCYGLfGKKRVISmgOJkMyyKRtbjgBjTTnGOx0MQTHrixiCobICJeKieK8bkGLiTiVS4vktTPDYUnkWGqzyQQJBUJqKnnLCQy5FaGSOKwEpoqUBQLNUthfCW9zvG8FqqJZQHWXJbZ4C0RAABrkNsDJOayqauSKjz2A4XmWj5+nHqh7k8vY0jPC8Rikg0NZWbJWDyfFSUGoy0hdMyqkueVWUebl3nhX56kTEh3yqBap4vGNkUyTZsWapSFAtWlG7sm52Wef1vnCm4yieLUJhTCkry3mS-p1cg6AAK6wLG8a6staknpKKjlblgrluVhULOhBiPMZFpiZ40rSNNj4AVdN0QIQ9mOUaHXOWaT2pNKPHvckJaDYszxKBoZTqIoaJuJ4oMNhd12xk1yXgoycNJsxLmicjr2OIS6NfUkrgqKUnxZCKpQnTV95ReD5NQ5TS1tac9OI4zL2o6zn2Y6Jyi5CWHw8tc0iZCT1kQ7dC1LbTa4Ixlsso29CsY8K+NWtknjJPYFYcpZADuvadi7SgiH+6CoHg9kAOIBzQdIAGJ0DQNAEHslJEC0D0uQSaRjJyzhOJhFoYtkrA4s8GRufcGQkadtVuyIHtKN+l2oKgsDzjgYBgCI-tUEHIdkOHkfR7H8dG7BidZbUO01C6qIcuoWf448edZIoWTIZJyzexAcBRP6UudYj3oYkF08vNofMkt8Osbybm73NisjWOWpR6DaE-Hna1oo6irDaISWYRSXQsyRGUYxhAU+6VNwpEJCNYKV9vQcieAWVCoxPoaAkp-Ks38yLCxAtOIBK0rBa2xMhUSYkXhZFUPxEwz9yreC0CYQGOslCURwFgx6adNKfHQprXcNt+LY0Zt6VWrwta0NmlARhXVXCqHWiWfeOFywkOPNUK0okSx6HnvIZ4gi9aAONJvDKhJxFX2zIiHQuh74GTEkhEw1QpiHReK7d23AXYiMRs8DETxdrPF3JoeQLxuLVX+KXOxntvY4EDL7RxGVXA3GPBMW2nxCGOE-s8FBgsyJlwrlXGudcG5NzCZuCYgVqg2HeCkLykoH4LAmKkcYXxcr6A1pyPwfggA */
    types: {} as {
      context: PlayerContext;
      events: PlayerEvents;
      actions: PlayerActions;
      actors: PlayerActors;
      guards: PlayerGuards;
    },
    id: 'player',
    type: 'parallel',
    context: {
      mode: PlayerPlayMode.normal,
      volume: 0.5,
      mute: false,
      tracks: [],
    },
    states: {
      media: {
        initial: 'stopped',
        description: 'track state',
        states: {
          stopped: {
            on: {
              PLAY: 'loading',
            },
          },
          loading: {
            invoke: {
              src: 'loadTrack',
              input: ({ context }) =>
                context.tracks[context.currentTrackIndex!],
              onDone: {
                target: 'playing',
                actions: [
                  assign({
                    currentTrackResourceInformation: ({ event }) =>
                      event.output as PlayerResourceInformation,
                  }),
                ],
              },
              onError: 'error',
            },
          },
          error: {
            on: {
              RETRY_LOAD: 'loading',
            },
          },
          playing: {
            entry: [
              log(
                ({ context }) =>
                  context.currentTrackResourceInformation
                    ? context.currentTrackResourceInformation
                    : undefined,
                '[Player PLAY]',
              ),
              'updateCurrentTrackResourceMediaMetadata',
            ],
            on: {
              PAUSE: 'paused',
              STOP: 'stopped',

              NEXT_TRACK: [
                {
                  target: 'loading',
                  actions: ['nextTrack'],
                  guard: { type: 'canNextTrack' },
                },
                {
                  target: 'stopped',
                  guard: { type: 'shouldStopPlay' },
                },
              ],
              PREV_TRACK: {
                target: 'loading',
                actions: ['prevTrack'],
              },
            },
          },
          paused: {
            on: {
              PLAY: 'playing',
              STOP: 'stopped',

              NEXT_TRACK: [
                {
                  target: 'loading',
                  actions: ['nextTrack'],
                  guard: { type: 'canNextTrack' },
                },
                {
                  target: 'stopped',
                  guard: { type: 'shouldStopPlay' },
                },
              ],
              PREV_TRACK: {
                target: 'loading',
                actions: ['prevTrack'],
              },
            },
          },
        },
      },
      window: {
        initial: 'normal',
        states: {
          normal: {
            on: {
              TOGGLE_FULLSCREEN: 'fullscreen',
            },
          },
          fullscreen: {
            on: {
              TOGGLE_FULLSCREEN: 'normal',
            },
          },
        },
      },
    },
    on: {
      SET_VOLUME: {
        actions: [
          {
            type: 'setVolume',
            params: ({ event }) => ({ volume: event.volume }),
          },
        ],
      },
      MUTE: {
        actions: [{ type: 'setMute', params: { mute: true } }],
      },
      UNMUTE: {
        actions: [{ type: 'setMute', params: { mute: false } }],
      },

      SET_TRACKS: {
        actions: [
          log(({ event }) => event.tracks, '[Player SET_TRACKS]'),
          {
            type: 'setTracks',
            params: ({ event }) => ({ tracks: event.tracks }),
          },
          'initCurrentTrackIndex',
        ],
        target: '.media.loading',
      },
      ADD_TRACK: {
        actions: [
          {
            type: 'addTrack',
            params: ({ event }) => ({ track: event.track }),
          },
        ],
      },
      REMOVE_TRACK: {
        actions: [
          {
            type: 'removeTrack',
            params: ({ event }) => ({ track: event.track }),
          },
        ],
      },
      SET_CURRENT_PLAY_TRACK: {
        actions: [
          {
            type: 'setCurrentPlayTrack',
            params: ({ event }) => ({ track: event.track }),
          },
        ],
      },
    },
  },
  {
    guards: {
      canNextTrack: ({ context }) => {
        switch (context.mode) {
          case PlayerPlayMode.normal:
          case PlayerPlayMode.single: {
            const { currentTrackIndex = 0 } = context;

            return currentTrackIndex + 1 < context.tracks.length;
          }
          case PlayerPlayMode.loop:
          case PlayerPlayMode.random: {
            return true;
          }

          default:
            return true;
        }
      },
      shouldStopPlay: ({ context }) => {
        switch (context.mode) {
          case PlayerPlayMode.normal:
          case PlayerPlayMode.single: {
            const { currentTrackIndex = 0 } = context;

            return currentTrackIndex + 1 >= context.tracks.length;
          }

          case PlayerPlayMode.loop:
          case PlayerPlayMode.random: {
            return false;
          }

          default:
            return false;
        }
      },
    },
    actions: {
      setVolume: ({ context }, { volume }) => {
        context.volume = volume;
      },
      setMute: ({ context }, { mute }) => {
        context.mute = mute;
      },

      setTracks: ({ context }, { tracks }) => {
        context.tracks = tracks;
      },
      addTrack: ({ context }, { track }) => {
        context.tracks.push(track);
      },
      removeTrack: ({ context }, { track }) => {
        context.tracks = context.tracks.filter((t) => t.id !== track.id);
      },
      nextTrack: ({ context }) => {
        if (context.currentTrackIndex === undefined) {
          context.currentTrackIndex = 0;
        } else {
          switch (context.mode) {
            case PlayerPlayMode.normal:
            case PlayerPlayMode.single: {
              if (context.currentTrackIndex + 1 < context.tracks.length) {
                context.currentTrackIndex += 1;
              }

              break;
            }
            case PlayerPlayMode.random: {
              context.currentTrackIndex = Math.floor(
                Math.random() * context.tracks.length,
              );
              break;
            }
            case PlayerPlayMode.loop: {
              if (context.currentTrackIndex + 1 < context.tracks.length) {
                context.currentTrackIndex += 1;
              } else {
                context.currentTrackIndex = 0;
              }
              break;
            }
            // no default
          }
        }
      },
      prevTrack: ({ context }) => {
        if (context.currentTrackIndex === undefined) {
          context.currentTrackIndex = 0;
        } else {
          switch (context.mode) {
            case PlayerPlayMode.normal:
            case PlayerPlayMode.single: {
              if (context.currentTrackIndex - 1 >= 0) {
                context.currentTrackIndex -= 1;
              }
              break;
            }
            case PlayerPlayMode.random: {
              context.currentTrackIndex = Math.floor(
                Math.random() * context.tracks.length,
              );
              break;
            }
            case PlayerPlayMode.loop: {
              if (context.currentTrackIndex - 1 >= 0) {
                context.currentTrackIndex -= 1;
              } else {
                context.currentTrackIndex = context.tracks.length - 1;
              }
              break;
            }
            // no default
          }
        }
      },
      setCurrentPlayTrack: ({ context }, { track }) => {
        context.currentTrackIndex = context.tracks.findIndex(
          (t) => t.id === track.id,
        );
      },
      initCurrentTrackIndex: ({ context }) => {
        switch (context.mode) {
          case PlayerPlayMode.normal:
          case PlayerPlayMode.single:
          case PlayerPlayMode.loop: {
            context.currentTrackIndex = 0;
            break;
          }
          case PlayerPlayMode.random: {
            context.currentTrackIndex = Math.floor(
              Math.random() * context.tracks.length,
            );
            break;
          }
          // no default
        }
      },

      updateCurrentTrackResourceMediaMetadata: ({ context, event }) => {
        const { currentTrackResourceInformation } = context;

        if (event.type === 'PLAY') return;

        if (currentTrackResourceInformation) {
          const { cover, artist, name, album } =
            currentTrackResourceInformation;

          if ('mediaSession' in navigator) {
            const metadata: MediaMetadataInit = {
              title: name,
              artist: artist?.name,
              album: album?.name,
              artwork: cover
                ? [
                    {
                      src: `${cover}?param=256y256`,
                      sizes: '256x256',
                      type: 'image/jpg',
                    },
                    {
                      src: `${cover}?param=512y512`,
                      sizes: '512x512',
                      type: 'image/jpg',
                    },
                  ]
                : [],
            };

            navigator.mediaSession.metadata = new MediaMetadata(metadata);

            // eslint-disable-next-line no-console
            console.log(
              '[Player updateCurrentTrackResourceMediaMetadata]',
              metadata,
            );
          }
        }
      },
    },
    actors: {
      loadTrack,
    },
  },
);

export default playerMachine;
