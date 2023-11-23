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

export type PlayerTrackState =
  | 'idle'
  | 'loading'
  | 'error'
  | 'playing'
  | 'paused'
  | 'stopped';

export type PlayerModeState = 'normal' | 'single' | 'shuffle' | 'loop';

type PlayerModeEvent =
  | { type: 'SET_MODE'; mode: PlayerModeState }
  | { type: 'NEXT_MODE' };

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
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgBcd0BjAazwEsJUwBiAZQFEAVAfRYCUBBAYQGkGAbQAMAXUQoA9rEoFKUgHaSQAD0QA2AOwAWPACYAjCICchgMwiAHBp36RhgDQhMmkVoMBWET60mdtoY6VgC+Ic5oWLiExOR4qFLoEJSKUHQQSmBUigBuUmRZkdj4RKQUCUkpUAgpeSTo8kqiYs0qyDJyCspIapq6BsZmljZ2Ds6uCDreeN4+Ihr65ib6ViYa5mERGMUxZfGJyal0uDhS+JEEAGZnALZ4RdGlcRWH1bVS9Y2Kza097bJfFTqBDGLSGPCGPwaDRmfw6cxWLTjRBmTwGEyeQyeXQiKb6OybEAPEqxCgnM50TisTgATV+0gBXSBiEMhhWEPM+j8izZViMnmRCBGeD8nnsgUMVlxWkJxN2cSKVToAAVuABVZj0okdQE9YHmOwDREGtaLHSsjSC1meEx4c0mBFWbxGHQO2XbR6k+7bJUMFgAeWVWv+nSUzIQBv0Rq0JoWBotVpWIhmWKs8ZE+k8BPCRI9JL2iqOADkmAANdhcPj8YM6pl6xCR6Oxs0JlyILTTExaDTY6xslaed1RfMKn1HZVUgBqHB4AhrjLD9YjhqMxtdcfNhktbaFOg8djWayzOgzrqHOyeFELaWYFdngnnoe6oH1K8lMfXLa3gv85jwVj5ACrGMPkTw0c9PQLdAAFdYEgFUABluDpcQ2lrRcX0QE9kymcx+1sdxzW3CZWWsPBYXMMFtBhY8IJHK8YLgiA6BLcsZyrR9dUwhBtD0IxTAsaxbHsJwdxAjwNFMKZTF0UjwJzOVL3uRj4InJhp0rOdUL+dDn16Hj+n4oYhNGUSSMlPR5n0YTPARTkNEMOj5QoWACCkZBkFUpCUIkHSFz04FeIGAThmEsYxKTFNPDTc0MyzfQnJuKQICyRRbnQVAWLLdgAFl-QAESYTi624yVwSMnQplZeFJKsK1JLRbtoskoJ+2AxLkqyWRUloLK2Lywriow-T4T-Wy2W7GN7H0LskTEhqRR7GwHHNfQVkchS8zwJKUrwWAAAtoMuS5etY3KCqK7SGSfcMYT-EQsw7ExgIep0THqh7Fuala2o2rZh22zr9ncvrzsGq7tX826HTwB69xtF7optK1gjRBwkchFZ1lxJyAHcUgyXG8DSnAbgyugAwAcUphCmDYAAxNUEIQhheCpJgiyGgKWWA4K4UxIJzFqwV8TRExxeemwLBEkQNk2gH8cUQm8EuaDUFQWASBwMAwEUCn-Wp2mGaZlm2aYDmufDMq+cqgWausK0MRmOZpVxfEETCHM0pS+A-jzNCoaXABafFBRDyyXcjuYEvli9SQDm6l1Dnc8KsZ25izOy1i3JylOoWgE64kauzwTkXo7WXKLw8xBVqu0mo0KUe1twdY8g54DiqQuSv0xE9EhNYbCFyjlnencnTRIxJW8ZvMzdNv6LwckcG74bgTZJZ-zZeE+T7bsdEFY1S60J08OxLRM1CBfnO9LAu78xPuIvwVXTRWyTHmAC8Twv7cwBpTkAqQgKvbmCBxrkVXJ4TwCxVgOitKyDwzotDuGApVGwMpr5KVcu5TywCH5F2BGKNOMY+QLAdIsLQc0SLrVhqmCW5hvCQnkv9HYO0wAgPDMnEiDD7qpm8MsShlFf5yjYcTdKqAOFLmfmJV04JTDLDwh2NBDgOq7W6lAAu+Ce76iFrDBYmIkYnmrgKea8wDA9j8PCawHZ8SqK6odY6mjroEMQNFNOCIVgX27JKWWxEWSSQ0OY7Ev5rFih0HY4GyBJHcSsHuciVkP6+AAksFGMMbRmERDYBy6w8YEykLjaJ+kuGaDGi7JYldvBC1yUrfJYjSYZUKcCaREwRIzDTOYHhUCYzQmYX-HYitlaq3VprbWutGlYVMAYVYD1oSWJniYlpuJYbtM6diIW0JPYhCAA */
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
            description: 'Player track idle state',
            on: {
              SET_TRACKS: {
                target: 'loading',
                actions: ['SET_TRACKS'],
              },
            },
          },
          loading: {
            invoke: {
              description: 'Load track',
              src: 'loadTrack',
              onDone: {
                target: 'playing',
                description: 'Track loaded',
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
            description: 'Player track error state',
            on: {
              RETRY: 'loading',
            },
          },
          playing: {
            description: 'Player track playing state',
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
