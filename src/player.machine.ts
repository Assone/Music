import { forkJoin, lastValueFrom, map } from 'rxjs';
import { assign, createMachine, fromPromise, log } from 'xstate';
import { getSongDetail, getSongUrl } from './apis';

export enum TrackType {
  song,
  video,
}

interface PlayerTrackData {
  id: number;
  url: string;
  name: string;
  artist: string;
  artistId: number;
  cover: string;
}

export interface PlayerTrack {
  id: number;
  type: TrackType;
}

export type PlayerModeState = 'normal' | 'single' | 'shuffle' | 'loop';

export interface PlayerMachineContext {
  volume: number;
  history: PlayerTrack[];
  tracks: PlayerTrack[];
  mode: PlayerModeState;
  currentTrack?: PlayerTrack;
  currentTrackIndex?: number;
  currentTrackData?: PlayerTrackData;
}

export type PlayerTrackState =
  | 'idle'
  | 'loading'
  | 'error'
  | 'playing'
  | 'paused'
  | 'stopped';

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
  | { type: 'ADD_TRACK'; track: PlayerTrack }
  | { type: 'REMOVE_TRACK'; track: PlayerTrack }
  | { type: 'CLEAR_TRACKS' }
  | { type: 'SET_TRACKS'; tracks: PlayerTrack[] };

type PlayerHistoryEvent =
  | { type: 'ADD_HISTORY'; track: PlayerTrack }
  | { type: 'REMOVE_HISTORY'; track: PlayerTrack }
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

const loadTrack = fromPromise<PlayerTrackData, { currentTrack: PlayerTrack }>(
  ({ input }) => {
    const { currentTrack: track } = input;

    if (!track) return Promise.reject(new Error('Track is undefined'));

    switch (track.type) {
      case TrackType.song: {
        const result = forkJoin([
          getSongUrl(track.id),
          getSongDetail(track.id),
        ]).pipe(
          map(([songUrl, songDetail]) => {
            const [urlDetail] = songUrl;
            const [detail] = songDetail;
            const { cover } = detail!.album;
            const {
              artists: [artist],
            } = detail!;

            return {
              id: track.id,
              url: urlDetail!.url,
              cover,
              name: detail!.name,
              artist: artist!.name,
              artistId: artist!.id,
            } as PlayerTrackData;
          }),
        );

        return lastValueFrom(result);
      }

      default:
        return Promise.reject(new Error('Unknown track type'));
    }
  },
);

const player = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgBcd0BjAazwEsJUwBiAZQFEAVAfRYCUBBAYQGkGAbQAMAXUQoA9rEoFKUgHaSQAD0QA2AOwAWPACYAjCICchgMwiAHBp36RhgDQhMmkVoMBWET60mdtoY6VgC+Ic5oWLiExOR4qFLoEJSKUHQQSmBUigBuUmRZkdj4RKQUCUkpUAgpeSTo8kqiYs0qyDJyCspIapq6BsZmljZ2Ds6uCDreeN4+Ihr65ib6ViYa5mERGMUxZfGJyal0uDhS+JEEAGZnALZ4RdGlcRWH1bVS9Y2Kza097bJfFTqBDGLSGPCGPwaDRmfw6cxWLTjRBmTwGEyeQyeXQiKb6OybEAPEqxCgnM50TisTgATV+0gBXSBiEMhhWEPM+j8izZViMnmRCBGeD8nnsgUMVlxWkJxN2cSKVToAAVuABVZj0okdQE9YHmOwDREGtaLHSsjSC1meEx4c0mBFWbxGHQO2XbR6k+7bJUMFgAeWVWv+nSUzIQBv0Rq0JoWBotVpWIhmWKs8ZE+k8BPCRI9JL2iqOADkmAANdhcPj8YM6pl6xCR6Oxs0JlyILTTExaDTY6xslaed1RfMKn1HZVUgBqHB4AhrjLD9YjhqMxtdcfNhktbaFOg8djWayzOgzrqHOyeFELaWYFdngnnoe6oH1K8lMfXLa3gv85jwVj5ACrGMPkTw0c9PQLdAAFdYEgFUABluDpcQ2lrRcX0QE9kymcx+1sdxzW3CZWWsPBYXMMFtBhY8IJHK8YLgiA6BLcsZyrR9dUwhBtD0IxTAsaxbHsJwdxAjwNFMKZTF0UjwJzOVL3uRj4InJhp0rOdUL+dDn16Hj+n4oYhNGUSSMlPR5n0YTPARTkNEMOj5QoWACCkZBkFUpCUIkHSFz04FeIGAThmEsYxKTFNPDTc0MyzfQnJuKQICyRRbnQVAWLLdgAFl-QAESYTi624yVwSMnQplZeFJKsK1JLRbtoskoJ+2AxLkqyWRUloLK2Lywriow-T4T-Wy2W7GN7H0LskTEhqRR7GwHHNfQVkchS8zwJKUrwWAAAtoMuS5etY3KCqK7SGSfcMYT-EQsw7ExgIep0THqh7Fuala2o2rZh22zr9ncvrzsGq7tX826HTwB69xtF7optK1gjRBwkchFZ1lxJyAHcUgyXG8DSnAbgyugAwAcUphCmDYAAxNUEIQhheCpJgiyGgKWWA4K4UxIJzFqwV8TRExxeemwLBEkQNk2gH8cUQm8EuaDUFQWASBwMAwEUCn-Wp2mGaZlm2aYDmufDMq+cqgWausK0MRmOZpVxfEETCHM0pS+A-jzNCoaXABafFBRDyyXcjuYEvli9SQDm6l1Dnc8KsZ25izOy1i3JylOoWgE64kauzwTkXo7WXKLw8xBVqu0mo0KUe1twdY8g54DiqQuSv0xE9EhNYbCFyjlnencnTRIxJW8ZvMzdNv6LwckcG74bgTZJZ-zZeE+T7bsdEFY1S60J08OxLRM1CBfnO9LAu78xPuIvwVXTRWyTHmAC8Twv7cwBpTkAqQgKvbmCBxrkVXJ4TwCxVgOitKyDwzotDuGApVGwMpr5KVcu5TywCH5F2BGKNOMY+QLAdIsLQc0SLrVhqmCW5hvCQnkv9HYO0wAgPDMnEiDD7qpm8MsShlFf5yjYcTdKqAOFLmfmJV04JTDLDwh2NBDgOq7W6lAAu+Ce76iFrDBYmIkYnmrgKea8wDA9j8PCawHZ8SqK6odY6mjroEMQNFNOCIVgX27JKWWxEWSSQ0OY7Ev5rFih0HY4GyBJHcSsHuciVkP6+AAksFGMMbRmERDYBy6w8YEykLjaJ+kuGaDGi7JYldvBC1yUrfJYjSYZUKcCaREwRIzDTOYHhUCYzQmYX-HYitlaq3VprbWutGlYVMAYVYD1oSWJniYlpuJYbtM6diIW0JPYhCAA */
    id: 'player',
    type: 'parallel',
    context: {
      volume: 0,
      history: [],
      tracks: [],
      mode: 'normal',
    },
    types: {} as { events: PlayerEvent; context: PlayerMachineContext },
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
                actions: ['SET_TRACKS', log('Set tracks')],
              },
            },
          },
          loading: {
            description: 'Player track loading state',
            invoke: {
              src: 'loadTrack',
              input: ({ context }) => ({
                currentTrack: context.currentTrack,
              }),
              onDone: {
                target: 'playing',
                description: 'Track loaded',
                actions: [
                  assign({
                    currentTrackData: ({ context, event }) => {
                      const { currentTrack } = context;

                      if (currentTrack === undefined) return undefined;

                      const source = event.output as PlayerTrackData;

                      if (!source) return undefined;

                      return {
                        ...currentTrack,
                        ...source,
                      };
                    },
                  }),
                  log('Track loaded'),
                ],
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
        on: {
          SET_MODE: {
            actions: ['SET_MODE'],
          },
          NEXT_MODE: {
            actions: ['NEXT_MODE'],
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
    actors: {
      loadTrack,
    },

    actions: {
      ADD_HISTORY: ({ context, event }) => {
        if (event.type !== 'ADD_HISTORY') return;

        context.history.push(event.track);
      },

      NEXT_MODE: assign({
        mode: ({ context, event }) => {
          if (event.type !== 'NEXT_MODE') return context.mode;

          switch (context.mode) {
            case 'normal':
              return 'single';
            case 'single':
              return 'shuffle';
            case 'shuffle':
              return 'loop';
            case 'loop':
              return 'normal';
            default:
              return 'normal';
          }
        },
      }),
      SET_MODE: assign({
        mode: ({ context, event }) => {
          if (event.type !== 'SET_MODE') return context.mode;

          return event.mode;
        },
      }),
      SET_TRACKS: ({ context, event }) => {
        if (event.type !== 'SET_TRACKS') return;

        const { mode } = context;
        const { tracks } = event;

        const index =
          mode === 'shuffle' ? Math.floor(Math.random() * tracks.length) : 0;
        const track = tracks[index];

        context.tracks = tracks;
        context.currentTrackIndex = index;
        context.currentTrack = track;
      },
      NEXT_TRACK: ({ context }) => {
        if (context.currentTrackIndex === undefined) {
          context.currentTrackIndex = 0;
        } else {
          const { mode } = context;

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
      PREV_TRACK: ({ context }) => {
        if (context.currentTrackIndex === undefined) {
          context.currentTrackIndex = 0;
        } else {
          const { mode } = context;

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
