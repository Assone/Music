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
  mv,
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
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgFtIBLdAYgGUBRAFQH0A1AeQBkBVAWSoG0AGAXUQoA9rGIAXYsIB2QkAA9EARl4AOAGx51AdgCs2gMwAWHboBMR3eoA0ITIjPajeI73Vn9upRoNOAvn62aFi4hCTkHGw0PAJyyKISUrJICsoqZniqTgCcxtmWSto2doiqSi7ZldlKuW7qZUYBQRjY+EQQpGRsAHKR0XyCKfFikjJyighK6XiGvEauhUVmSrb2k668eB5KBmoG9dpm2dpNIMGtYR3k1PQ0AEoAggDCANIUA3EJo8mgEzvaq0QRlUzlUulySks6l4vAMZlUp3OoXanQeABE0XR7s8Xh8hl8kuNlLxspswbp5gZdFkqQCSpNtNo8NldAYlBZDiZzAjAmcWsjwmQ7lQOEwGFQsY9XniRCNCSk-rw9HgVNlHNUjIYjgZAetspptHNfGYldDLLpEfy2oKbnQnmw7sLuvQAAosB4ATUlOJlZwJYwVxLZW3U+VD+WyWTMuqU4IMKv0RlpqgM+x2lpC1queFg4mEyGQkDIbs9vuGiQDv2U0KZSt43hZ2khnN1RXj1QpPks+SU6gzFxR6DwqGE6A60igZAgMjAeGI0gAbsIANazpFZ0jD0fjqAIedLgDG6G+AzL-p+qUmNbwdYb+mbFl1njwrNJRiOWVU9cavPXl03I5jvOk64Dgwj4ME4gAGbgQQeB-oOW5AROe6LsIR4ngIZ5ypWl41PkN4GFG9ZTNoqjRvSb4vuRNTuGqapuP2ArZqB4FCrQdxeiwTDothFYXhMJqwiqriakYNTpLoupgs4ahmGY9RJsCvCOExG5DucwHFg8bDUHx3xEgg0IZJq6hWE22j5B4dJrKSTImiaFLvsscw8s0mb-hpLRaRQNBMC6+nylWkyQroWhwkUugwgYxzmK2hQzGZ6jGIsyUpmpnnwd5E5kN0VAABq3FKuKxPiOECWkljhY4ZnRbFFFrBo5T1KSjlmL4REnL+VqZZpOV5YV3rSkogyyvxhlTFVyU1VFsL1a29QhroVgmrSy3ZBliF9ZOLrCgwQ0laNfrlRNoXVZFdV6A1iAsqoIkmiC7UqBSXXuQO4TwegACusBFiWHqBbhEy+PZ+iWRYqj6m4qi6o2Mz1pG8lfvJFibR9yDfb9ECUH5AWlWNBmBggINbGDarAlD9QxuyoIFJCaoKUmaPZhjP1FgNRU+vjx3jUTJPWeDFPQlT9KkWFxheF+LKuIjzObqzWO5QVnPDUd5aE8F-NkxDlMw-S1KaPW5kqcC+hqnLGmY39e0HYDFXE4ypOMuTkPC3razsk2MyI-M6jqJCkIZQA7vO05B3g0iwegqBkH5ADiccsBKABibAsCwFBPMKVDdHbE1lFsqpGPkRSkmqMZlEy-tzKy5HqmRweh8I4dQV9qCoLAB44GAYDSLHTAJ0ndCp+nmfZ7n3Pq0FeEFy5EamWX10MjoKoqJ1lk7O+fanJHEBwHEVqfCdRMALSPvSJ-b29zGkEfvPBZDupUhkYK5Ms8ngqyP7X+pOZ5gWkA74azwsXeMMJGTyXyClZaC1nDiU7Mlbs4kr58g8ohQCO4gHTz+JZWsRFIa9kMEmKk0l1DOF7MtKKKYvDsiUBbPArEcBYKBg4XsGQdCxncPguY2RpLHGZJGR6q0ZJuVQe9Fm2UoDMPtk2Zw00yLF0OERXsfDyjwnMH7Q0ehlooIQujK2EBpGGXks4FaUIsh6A4UvdkX5MgqCUg5GKuieoh2kGHIxRNz4ex0NkLQ9jKjFzcIyC03UPKuLDhHKOqAPHBUODGRk8YagdXfpUbwISf54HCc3PArd26d27r3GJl4ZZbEhrCakXJi5SVFsErQuRGRlCyKGRkAQAhAA */
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
            target: '.loading',
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
