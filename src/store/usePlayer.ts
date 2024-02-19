import playerMachine, {
  type PlayerContext,
  type TrackData,
} from '@/services/machine/player';
import { isArray, isClient } from '@/utils/is';
import { createBrowserInspector } from '@statelyai/inspect';
import { Actor, createActor, type Snapshot } from 'xstate';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  context: PlayerContext;
  isPlaying: boolean;

  currentTime?: number;
  duration?: number;
}

interface Action {
  // controls
  play: (tracks?: TrackData[]) => void;
  pause: () => void;
  stop: () => void;

  // volume
  setVolume: (volume: number) => void;
  mute: () => void;
  unmute: () => void;

  // tracks
  setTracks: (tracks: TrackData[]) => void;
  addTrack: (track: TrackData) => void;
  removeTrack: (track: TrackData) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setCurrentPlayTrack: (track: TrackData) => void;
}

const registerActions = (actor: Actor<typeof playerMachine>): Action => {
  // controls
  const play = (tracks?: TrackData[]) => {
    if (isArray(tracks)) {
      actor.send({ type: 'SET_TRACKS', tracks });
    }

    actor.send({ type: 'PLAY' });
  };
  const pause = () => {
    actor.send({ type: 'PAUSE' });
  };
  const stop = () => {
    actor.send({ type: 'STOP' });
  };

  // volume
  const setVolume = (volume: number) => {
    actor.send({ type: 'SET_VOLUME', volume });
  };
  const mute = () => {
    actor.send({ type: 'MUTE' });
  };
  const unmute = () => {
    actor.send({ type: 'UNMUTE' });
  };

  // tracks
  const setTracks = (tracks: TrackData[]) => {
    actor.send({ type: 'SET_TRACKS', tracks });
  };
  const addTrack = (track: TrackData) => {
    actor.send({ type: 'ADD_TRACK', track });
  };
  const removeTrack = (track: TrackData) => {
    actor.send({ type: 'REMOVE_TRACK', track });
  };
  const nextTrack = () => {
    actor.send({ type: 'NEXT_TRACK' });
  };
  const prevTrack = () => {
    actor.send({ type: 'PREV_TRACK' });
  };
  const setCurrentPlayTrack = (track: TrackData) => {
    actor.send({ type: 'SET_CURRENT_PLAY_TRACK', track });
  };

  return {
    play,
    pause,
    stop,

    setVolume,
    mute,
    unmute,

    setTracks,
    addTrack,
    removeTrack,
    nextTrack,
    prevTrack,
    setCurrentPlayTrack,
  };
};

const usePlayer = create<State & Action>()(
  devtools((set) => {
    const { inspect } = import.meta.env.DEV
      ? createBrowserInspector()
      : { inspect: undefined };
    const actor = createActor(playerMachine, {
      snapshot: isClient
        ? (JSON.parse(
            localStorage.getItem('player') as string,
          ) as Snapshot<unknown>)
        : undefined,
      inspect,
    });
    const actions = registerActions(actor);

    actor.subscribe((snapshot) => {
      const { media } = snapshot.value as {
        media: 'stopped' | 'playing' | 'paused';
        window: 'normal' | 'fullscreen' | 'minimized';
      };

      if (isClient) {
        localStorage.setItem(
          'player',
          JSON.stringify(actor.getPersistedSnapshot()),
        );
      }

      set({ context: snapshot.context, isPlaying: media === 'playing' });
    });

    actor.start();

    const { context } = actor.getSnapshot();

    return {
      ...actions,
      context,
      isPlaying: false,
    };
  }),
);

export default usePlayer;
