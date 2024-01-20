import playerMachine, {
  type PlayerContext,
  type TrackData,
} from '@/services/machine/player';
import { isArray } from '@/utils/is';
import { Howl } from 'howler';
import { Actor, createActor, type Snapshot } from 'xstate';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  context: PlayerContext;
  isPlaying: boolean;
  isLoading: boolean;
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
    let howler = new Howl({ src: [''] });
    const state = import.meta.env.SSR
      ? undefined
      : (JSON.parse(
          localStorage.getItem('player') as string,
        ) as Snapshot<unknown>);

    const actor = createActor(playerMachine, {
      devTools: true,
      snapshot: state,
    });
    const actions = registerActions(actor);
    let prevTrack: TrackData | undefined;

    actor.subscribe((snapshot) => {
      set({ context: snapshot.context });

      if (import.meta.env.SSR === false) {
        localStorage.setItem(
          'player',
          JSON.stringify(actor.getPersistedSnapshot()),
        );
      }
    });

    actor.subscribe((snapshot) => {
      const { value } = snapshot;
      const {
        currentTrackResourceInformation,
        tracks,
        currentTrackIndex,
        volume,
      } = snapshot.context;
      const { media } = value as { media: string };

      if (media === 'playing' && currentTrackResourceInformation) {
        if (
          prevTrack?.id === tracks[currentTrackIndex!]?.id &&
          howler.playing() === false
        ) {
          howler.play();
        } else {
          howler.unload();

          howler = new Howl({
            src: [currentTrackResourceInformation.url],
            html5: true,
            volume,
          });

          howler.once('end', () => {
            actions.nextTrack();
          });

          howler.play();
        }

        prevTrack =
          snapshot.context.tracks[snapshot.context.currentTrackIndex!];
      } else if (media === 'paused') {
        howler.pause();
      } else if (media === 'stopped') {
        howler.stop();
      }
    });

    actor.subscribe((snapshot) => {
      const { value, context } = snapshot;
      const { media } = value as { media: string };
      const { volume, mute } = context;

      howler.mute(mute);

      if (howler.volume() !== volume) {
        howler.volume(volume);
      }

      set({ isPlaying: media === 'playing', isLoading: media === 'loading' });
    });

    actor.start();

    const { context } = actor.getSnapshot();

    return {
      ...actions,
      context,
      isPlaying: false,
      isLoading: false,
    };
  }),
);

export default usePlayer;
