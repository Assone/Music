import { createMachine, log } from 'xstate';

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

export interface PlayerContext {
  mode: PlayerPlayMode;
  volume: number;
  mute: boolean;
  tracks: TrackData[];
  currentTrackIndex?: number;
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

type PlayerGuards = { type: 'canNextTrack' } | { type: 'shouldStopPlay' };

const playerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgFtIBLdAYgGUBRAFQH0A1AeQBkBVAWSoG0AGAXUQoA9rGIAXYsIB2QkAA9EAdgAsADjwqAzFoBsWgJwreBpQCYArAEYANCEyIrSpXgMWtV7SudLearQC+AXZoWLiEJOQcbDQ8AnLIohJSskgKyroqePpmakY6amYeZnYOCGpWeBa8NWaWNTXGZkEhGNj4RBCkZGwActGxfIJpiWKSMnKKCEqZmmr+1Wa8Fmq8ZkqljlYGBnhOVv41Sjsqus3BIKHtEV3k1PQ0AEoAggDCANIUQwlJ46mgUzMp2yalUBg8vCsa3cak2CEMWSsWlyBl0FiMZk8RRalza4U63WeABEiXQnm93t8Rr8UpNlBYzNkkVp0VpjLolBZdHCDCY8BUgTsDAdkWicVd8ZEyI8qBwmAwqGSXh8qSIxrS0lMlHp+RygRylE5eBt7Fs1nhDaCtCYVDteCpxXiOlL7nRXmxHjLevQAAosZ4ATSVFNVlxpE01iF04Lwa1UdSxTlUcKhvF0eDMaP0B22al0TkdYWdtzwsHEwmQyEgZD9gdDo2SEYBiHBWjwWkKeeR205Bzh7gs7aslhFRmsZ0L1wJ6DwV2I0igNeebGo9fD-3SCCsVhW2Uhet83mjFjhhRcxQstucRVWFknkpLc4XlBoTB9a-VTc32457aWpzMYVckArR+zUQcBVOcDjAAqx72LUhZzaedF16KgAA0HmVSl4mpT8NymYdwItCxjkMLRfDREpTQQdQsnA8FoxUKFmJ2eCbkQp9UIwrCQysYY1UbAiWx0dtOxyHtrFhGi6P5YcuUKdRSN4PR2OnJCsBQmsZQYYMVVwwS-jpLcWTbPJjW8BlmM5OEOw0dl1jWVYKKUNQ1MiWd0AAV1gatawDD8hOM050zHQDUR0ZYdjhSiqjOdRtT8TlwXcx9vN8iAXzfQKjMjWjdFClQGR2fRrXRAwwLbbRVDRZigWHXRUs49LqzQzC9JwgSw3w4ydxNMpDXTa1wTcXQ8xUxqLglBCZ2QFrMra3iVX4n4erykLXCK8LSqiiqaPcRlwXjVzOQqfwmtm+btKoXTyX0rqG1y5sEDqQckVyPwdxZIo4XzXZwLOVELGBnZDHYgB3ecIGEcG8GkYQcAIdBUDIV8AHE0ZYRUADE2BYFgKFeGUqF6HKNWenMMyhEbMh0A0VBTFQimyQUPoqErJtaIs8Eh6RodhgAzLzUFQWAAGMcDAMBpFRpgMaxuhcfxwnidJgzuqCvLKcxExDFpvRnAZmikW1PYgWcndLLBnF4YgOAEidVbNeegBaIE4RdzncW56cnae78TDhSx0wcrsVIspQLtLctK0gP3yc3VYsmRJz-FbbcjbKUj0zG1R0R3bMWSjrj46-QiXPbXljiWBo6LAobhygy97TOOCpqdDjLp8uO8OdzdzbN20DA+yE7MzxAKhcGZBXUKxdGNQoIahmHS+El7x63XJB3i4fh5MAx5jvdvud5-m4YRpHUFX4zzBTCjdiWQody5UxMyPrnrlPmG8CFkXxcl6W191p8hRGmfM8wkSKTvhUC0n1SLDUAioB0QQAhAA */
    types: {} as {
      context: PlayerContext;
      events: PlayerEvents;
      actions: PlayerActions;
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
              PLAY: 'playing',
            },
          },
          playing: {
            on: {
              PAUSE: 'paused',
              STOP: 'stopped',

              NEXT_TRACK: [
                {
                  actions: ['nextTrack'],
                  guard: { type: 'canNextTrack' },
                },
                {
                  target: 'stopped',
                  guard: { type: 'shouldStopPlay' },
                },
              ],
              PREV_TRACK: {
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
                  actions: ['nextTrack'],
                  guard: { type: 'canNextTrack' },
                },
                {
                  target: 'stopped',
                  guard: { type: 'shouldStopPlay' },
                },
              ],
              PREV_TRACK: {
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
            target: '.playing',
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
    },
  },
);

export default playerMachine;
