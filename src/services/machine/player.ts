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
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgYgGUBRAFQH0A1AeQBkBVAWSIG0AGAXURQHtYBLAC59uAOy4gAHogCcAdlYA6AIwAmABxzZ0gMysAbGu0AaEJkQrWAFgXT9KgKzbtatbPmy1AX08m0WXHgMdCQsHOLIvILCYkiSMtLWspZ6SrLa9kpqehmWJmYISqxqCpaOhfZ2HunevhjY+HQAckEhbJyxEfxCouJSCNJZyoZ6Oipu9jl5iKo1IH71hKRkJABKAIIAwgDSBG3hkd0xoH1uUwj2akoK6TqyKZbSKrPzAWsAIm-L69t7HQfRvRkSWuRVkKgcshylhUZ0yrBUCnUSkshTU9mhrHssmedQCKyIDCoFCIX02W1+PC6ANifWkFwU9j0Kj0rG0ehZtnUsPk9gUaiRd1YrEyqJx-nwxHIGzoK3xjXIAAUaGsAJqkn5hP5Uno0mTIhRgsaWZLqFKXWEc65JBJKZE2vRi+oKAC2kD46AUsAE3GQyEgeCVqopc3+OuO020lm0NjukLU8O0hWkejOkOkiI0rC0TLZyUduBdbo9qG46AgfBEUDwEFEYAUFYAbtwANZ1l44Qvl4ul8uVhCN7gAY3Qhzawc6UTDcQKkejcj0cYTSZTpiBCLspRSaT0pS8PjmuI7rq7ChLZYrVdwOG4Hb8AgAZjfnQp2533aeexf+yIm8PRxxx1DI5p1SXQbFKSw0TUSxZCULFZFhVI9D5SDpCUbIBmhMF8yPIsFCvG88HxVY1RoKh3kA7VgL6VJLEUKx5AcFkkgMFd8ltZlrlQzF4V4+wcLfD15gvAM1joYhKMnajEH5Xlkxcex1HBVJ4TOVxZERCZ5Gg3QxkeATj3fYTK0IEgqAVSTDkBAp9HTeNIMyB5dGgtSwQNTNDEg3RHEsAy8OMqtGiIAANchVjJSzqXDGyRj5KxLmgnQilyVcCltax1FsIofKyS4-JPAKA3xCh1XJTVKSk6zCli+yEqc5LYRUQoDWhODWOyxT8qM9AAFdYH9QMVUiqcTg8BRhUZC50O0FQ6PsM5Hg0yEsQsIU0WFXz91fQyhN6-qIFM8zhukhA3GKCbskuPQZrm1NFPG7RbDcEZHuhbQut2vr-SC0LSuO6yzvGtqpuu2bMVhdJrGSVxEwTaDXA+l89oG4q-vKkMqIBsaLpBm7wdS5EKhsJrXB0B5hieLbDwUAB3CsaxphQRCfdBUDwMyAHEOZoEkADE6BoGgCA2fEiEaf7dQQJrkKa1g0LuGC5DGNjEAeRQ0QSLNPJFfiqfFWn6e4Rn7x61BUFgQccDAMARHZqguZ5sh+cF4XRfF9GJysyXpcRJMkMVsE7jOY1FBuR6mQmOkEm8fdmYgOBwkPfZMcl20zmZXkbjo1JkUXB09adHbk8qyWLg0mbWWySNHFss4mXox79Cu406OkRGvR9P0IGLr3otUFR0zQ6FklKLM2WMVK03cp7kxUXN89qfWdo-c9Kx7qKQMcOdSkU7OsjotREPQg1skZeQZvBDJEYInB15G6YNHTLF+Wg5c0RhAmlEjGwL5GVRHDOojAKd8To6GKP-IoKQLAaAnvkBSfJG5RheomJkQDkbdy1CXaK11M4WDZD5GuIxUzskRJiJI-JVroU2ovJ0dMRAMxAdZew0gzjpARBrR6Gg0TpARgXAsdCGZMxZqgRhqcszB2SCULCiYMiPx3AJARRsFAmzNhbK2NtRHRRbhmWwLgW6wSahI4oCQxgyMyNIZMm1vBAA */
    types: {} as {
      context: PlayerContext;
      events: PlayerEvents;
      actions: PlayerActions;
      actors: PlayerActors;
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

              NEXT_TRACK: {
                target: 'loading',
                actions: ['nextTrack'],
              },
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

              NEXT_TRACK: {
                target: 'loading',
                actions: ['nextTrack'],
              },
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
