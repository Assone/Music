import { lastValueFrom, map } from 'rxjs';
import { assign, createMachine } from 'xstate';
import { getSongUrl } from './apis';

export enum TrackType {
  song,
  video,
}

interface SourceInfo {
  id: number;
  type: TrackType;
  url: string;
}

export interface PlayerTrackData {
  id: number;
  type: TrackType;
  name: string;
}

export interface PlayerMachineContext {
  volume: number;
  history: PlayerTrackData[];
  tracks: PlayerTrackData[];
  currentTrack?: PlayerTrackData;
  currentTrackIndex?: number;
  currentTrackSourceInfo?: SourceInfo;
}

type PlayerModeEvent = { type: 'SET_MODE' } | { type: 'NEXT_MODE' };

type PlayerWindowEvent = { type: 'TOGGLE_FULLSCREEN' };

type PlayerControlEvent =
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STOP' }
  | { type: 'RETRY' };

// type PlayerProgressEvent = { type: 'SET_PROGRESS'; progress: number };

type PlayerPlaybackRateEvent = {
  type: 'SET_PLAYBACK_RATE';
  playbackRate: number;
};

type PlayerTrackEvent =
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' }
  | { type: 'ADD_TRACK'; track: PlayerTrackData }
  | { type: 'REMOVE_TRACK'; track: PlayerTrackData }
  | { type: 'CLEAR_TRACKS' }
  | { type: 'SET_TRACKS'; tracks: PlayerTrackData[] };

type PlayerHistoryEvent =
  | { type: 'ADD_HISTORY'; track: PlayerTrackData }
  | { type: 'REMOVE_HISTORY'; track: PlayerTrackData }
  | { type: 'CLEAR_HISTORY' };

type PlayerVolumeEvent = { type: 'SET_VOLUME'; volume: number };

type PlayerEvent =
  | PlayerModeEvent
  | PlayerWindowEvent
  | PlayerControlEvent
  // | PlayerProgressEvent
  | PlayerPlaybackRateEvent
  | PlayerTrackEvent
  | PlayerHistoryEvent
  | PlayerVolumeEvent;

const player = createMachine<PlayerMachineContext, PlayerEvent>(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgBcd0BjAazwEsJUwBiAZQFEAVAfRYCUBBAYQGkGAbQAMAXUQoA9rEoFKUgHaSQAD0QB2AIwAmPADYALAA5DGgKwbDATnPmt5gDQhMic-ut4dN68ZH3LLWMNAF8Q5zQsXEJicjxUKXQISkUoOgglMCpFADcpMizI7HwiUgoEpJSoBBS8knR5JVExZpVkGTkFZSQ1TV0DEzNLGzsHZ1cEQ3MRPB9ffQ1jIMMzMIiMYpiy+MTk1LpcHCl8SIIAM2OAWzwi6NK4ir3q2ql6xsVm1p722XeVdQQWi0Ik8+i0Gh0AGYNEYtNYgpDxohghovLYHDpdMZIYYjGsQLcSrEKIdjnROKxOABNL7SX5df6IIH6fR4SwiSG+Cz+czWJEIYw6VkadHGcx+awQ7z4wlbOJFKp0AAK3AAqsxaQSOn8egDIfo9JjgvpzCZfCIRMZ+cCNJCDOYhRoRFpIZCdDDjDKNndiTcNoqGCwAPJKzU-TpKRkIfWGoIw03Gc2W63ePQBfTGUwgsw6HReqJE7YK-bBgDipYAMkw2EqK9wqTW1RrxG1tQzdYgY144yazX5ky4mbpDHgMfp9VM4c785t7hRi2kAHJMAAa7C4fH4YbbkY70YN3eNCaTVsHCG0eklRiWQKsnMhM59Rf9+yVFIAahweAJt-Td6A9QPI14z7C1TwmCVZh0SVLVtR1H0LeUXzSZh12-QRfwjboAM7ICe2PftwMQax-DwTMdFMSxsWWUJwgJb1EPndAAFdYEgZU6xpFtvh3bDekmYxhWBGDrB0EEuX0a1wRHE0hREd0nQdcwELlJjWPYstK2rWt60bdUmEwnUcP3WMj1AgcJmBeS8FdXlBWxfVrGsfQVLnG4WLYiA6GXNcv03Qz22Mi8BlMCwrFsAJrREGwDGzLRDEhS0VmlOjZTc5APPYt8mE-Dcf24uksKjYLryGcLRicM8gVxPARANUZIXFWxaPWAtVLwWACCkZBkCyziAv-fiSsGMKRkiqrUzZBwMyzawczzVKGLwS4pAgLJFCudBUG81d2AAWSDAARAyCq1P8+IBIItG7bMEt5SEliIwF3FReMmqsqFFhUla1o6qpaB23yDuOgaLsQBK7XMSFdFsXEFlzOxrRevA3sTD7oU9Ra2p+rJYAAC2Ys4zgBnz9qOk6JB486ow8O1-FxJzRPBJzESq5HUfhC1Psx1rNhxnZusBsmQdO8MjP42natNDwnMxEVrFZyyVlRZ13H8OaQR0cUVIAdxSDIdbwDacEuLa6E0qs2AAMVVCsKwYXgKSYRdQajK6brmu6Fce-lvHMPBGclQSxQWewXKxzY9cUA28DOZjUFQWASBwMAwEUc2g3LS2bbth2nZd0XeLdpYPZWRrvaCa1bFmRnEwhcUIS0MI6I2tb4G+BjW2pvcAFpvH5Pu7UD4fh4fCOn3ILuir3fuz2h4wa6chYjFNRYtdc31qFoKfxYBA1PHi0wlhIxLD-5Xk9AhE1TXcG0pg37ZHiqHfAv4+E9DBbRBQo9x7v5JZUSYmWIYYEUI7Dh15hPEkOAjg4BfoNS67oF5awtLTB68UKL-0ajZRYJhXQgK1isB+SEsDPyptPIKOh+QmD0OCa+WsITYnsGPSBjF3LqQgPAsGCBeSeGiuCeSIgrCpkMFFEUbJ5Ljn8JyLWLD6JtTcp1bqvVOHkN3m4XwbIxTOVsG6MUKYEq1WmpmQw2YpTfVWmALhUZZ6WWhv7VWvZGEgggfIvmlijabVQNYvcEJrRTDpr4E+OYphfXHvgfmshUjbzUa-PU+par1TEmCa+LokYZi8NfNGXMMYWN+vjQmxMrGxIQW4TMNl7I2EtO6F0VC2YZKFHYbJ8lcnhOWh4hI3UfHGVCgHOqsioYaEWL4fxdg2RBNdCyOqzllJtKjgbbp-FbGIHHIvXwcIrLojkbKeZUhDbG1Nt4kp3C-FnjEtdcUroXTwyBNBHmbjoi7MNnHBOScU5p0WQCUxngKIkRgroWSFhfbRVqg5a5jcYaYzCEAA */
    id: 'player',
    type: 'parallel',
    context: {
      volume: 0,
      history: [],
      tracks: [],
    },
    states: {
      track: {
        description: 'Player track state',
        initial: 'idle',
        states: {
          idle: {
            on: {
              SET_TRACKS: {
                target: 'loading',
                actions: ['SET_TRACKS'],
              },
            },
          },
          loading: {
            invoke: {
              src: 'loadTrack',
              onDone: {
                target: 'playing',
                actions: assign({
                  currentTrackSourceInfo: (context, event) => {
                    const { currentTrack } = context;

                    if (currentTrack === undefined) return undefined;

                    const [source] = event.data as SourceInfo[];

                    if (!source) return undefined;

                    return {
                      ...currentTrack,
                      url: source.url,
                    };
                  },
                }),
              },
              onError: 'error',
            },
          },
          error: {
            on: {
              RETRY: 'loading',
            },
          },
          playing: {
            entry: ['ADD_HISTORY'],
            on: {
              PAUSE: 'paused',
              STOP: 'stopped',

              NEXT_TRACK: {
                actions: ['NEXT_TRACK'],
                target: 'loading',
              },
              PREV_TRACK: {
                actions: ['PREV_TRACK'],
                target: 'loading',
              },
              SET_TRACKS: {
                actions: ['SET_TRACKS'],
                target: 'loading',
              },
            },
          },
          paused: {
            on: {
              PLAY: 'playing',

              NEXT_TRACK: {
                actions: ['NEXT_TRACK'],
                target: 'loading',
              },
              PREV_TRACK: {
                actions: ['PREV_TRACK'],
                target: 'loading',
              },
            },
          },
          stopped: {
            on: {
              PLAY: 'loading',
            },
          },
        },
      },
      mode: {
        description: 'Player mode: normal, single, shuffle, loop',
        initial: 'normal',
        states: {
          normal: {
            on: {
              NEXT_MODE: 'single',
            },
          },
          single: {
            on: {
              NEXT_MODE: 'shuffle',
            },
          },
          shuffle: {
            on: {
              NEXT_MODE: 'loop',
            },
          },
          loop: {
            on: {
              NEXT_MODE: 'normal',
            },
          },
        },
      },
      window: {
        description: 'Player window state',
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
    services: {
      loadTrack: async (context) => {
        const { currentTrack: track } = context;

        if (!track) return Promise.reject(new Error('Track is undefined'));

        switch (track.type) {
          case TrackType.song:
            return lastValueFrom(
              getSongUrl(track.id).pipe(
                map((data) =>
                  data.map((item) => ({ ...item, type: track.type })),
                ),
              ),
            );
          default:
            return Promise.reject(new Error('Unknown track type'));
        }
      },
    },

    actions: {
      ADD_HISTORY: (context, event) => {
        if (event.type !== 'ADD_HISTORY') return;

        context.history.push(event.track);
      },

      SET_TRACKS: (context, event) => {
        if (event.type !== 'SET_TRACKS') return;

        const { tracks } = event;
        const [firstTrack] = tracks;

        context.tracks = tracks;
        context.currentTrackIndex = 0;
        context.currentTrack = firstTrack;
      },
      NEXT_TRACK: (context, event, meta) => {
        if (context.currentTrackIndex === undefined) {
          context.currentTrackIndex = 0;
        } else {
          const snapshot = meta.state;
          const { mode } = snapshot.value as { mode: string };

          switch (mode) {
            case 'normal': {
              context.currentTrackIndex += 1;
              break;
            }

            case 'single': {
              break;
            }

            case 'shuffle': {
              const randomIndex = Math.floor(
                Math.random() * context.tracks.length,
              );

              context.currentTrackIndex = randomIndex;
              break;
            }

            case 'loop': {
              if (context.currentTrackIndex === context.tracks.length - 1) {
                context.currentTrackIndex = 0;
              } else {
                context.currentTrackIndex += 1;
              }
              break;
            }
            // no default
          }
        }

        context.currentTrack = context.tracks[context.currentTrackIndex];
      },
      PREV_TRACK: (context, event, meta) => {
        if (context.currentTrackIndex === undefined) {
          context.currentTrackIndex = 0;
        } else {
          const snapshot = meta.state;
          const { mode } = snapshot.value as { mode: string };

          switch (mode) {
            case 'normal': {
              context.currentTrackIndex -= 1;
              break;
            }

            case 'single': {
              break;
            }

            case 'shuffle': {
              const randomIndex = Math.floor(
                Math.random() * context.tracks.length,
              );

              context.currentTrackIndex = randomIndex;
              break;
            }

            case 'loop': {
              if (context.currentTrackIndex === 0) {
                context.currentTrackIndex = context.tracks.length - 1;
              } else {
                context.currentTrackIndex -= 1;
              }
              break;
            }
            // no default
          }
        }
      },
    },
  },
);

export default player;
