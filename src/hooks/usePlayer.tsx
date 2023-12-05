import player, {
  PlayerMachineContext,
  PlayerModeState,
  PlayerTrack,
  PlayerTrackState,
} from '@/player.machine';
import { useMachine } from '@xstate/react';
import { PropsWithChildren, createContext } from 'react';
import { Snapshot } from 'xstate';

interface PlayerContextType {
  audio: HTMLAudioElement;

  context: PlayerMachineContext;
  mode: PlayerModeState;

  isPlaying: boolean;
  isPaused: boolean;

  canPlay: boolean;

  onTogglePlay: () => void;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onPrev: () => void;
  onNext: () => void;

  onSwitchMode: () => void;
  onSetMode: (mode: PlayerModeState) => void;

  onSetTrackAndPlay: (tracks: PlayerTrack[]) => void;
}

const PlayerContext = createContext<PlayerContextType>(null!);

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const snapshot = useMemo(() => {
    if (import.meta.env.SSR) {
      return undefined;
    }

    const stateStr = localStorage.getItem('player');

    return stateStr ? (JSON.parse(stateStr) as Snapshot<unknown>) : undefined;
  }, []);
  const [state, send, service] = useMachine(player, {
    snapshot,
    devTools: true,
  });
  const audio = useRef<HTMLAudioElement>(
    import.meta.env.SSR ? null! : new Audio(),
  );

  useEffect(() => {
    const subscription = service.subscribe((state) => {
      localStorage.setItem('player', JSON.stringify(state));
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [service]);

  useEffect(() => {
    const subscription = service.subscribe((state) => {
      if (state.matches('track.playing') && state.context.currentTrackData) {
        audio.current.src = state.context.currentTrackData.url;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [service]);

  useEffect(() => {
    const { track } = state.value as { track: PlayerTrackState };

    switch (track) {
      case 'paused':
      case 'stopped': {
        audio.current.pause();
        break;
      }

      case 'playing': {
        if (audio.current.paused && audio.current.src) {
          audio.current
            .play()
            .catch((err) => console.error('[Player Audio Play Error]', err));
        }

        break;
      }
      // no default
    }
  }, [state.value]);

  useEffect(() => {
    const { mode } = state.value as { mode: PlayerModeState };

    const onEnded = () => {
      if (mode === 'single') {
        audio.current.currentTime = 0;
      } else {
        send({ type: 'NEXT_TRACK' });
      }
    };

    audio.current.addEventListener('ended', onEnded);

    return () => {
      audio.current.removeEventListener('ended', onEnded);
    };
  }, [send, state.value]);

  const mode = useMemo(() => state.context.mode, [state.context.mode]);

  const isPlaying = state.matches('track.playing');
  const isPaused = state.matches('track.paused');
  const canPlay = state.context.currentTrackData !== null;

  const onPlay = useCallback(() => {
    send({ type: 'PLAY' });
  }, [send]);

  const onPause = useCallback(() => {
    send({ type: 'PAUSE' });
  }, [send]);

  const onTogglePlay = useCallback(() => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  }, [isPlaying, onPause, onPlay]);

  const onStop = useCallback(() => {
    send({ type: 'STOP' });
  }, [send]);

  const onPrev = useCallback(() => {
    send({ type: 'PREV_TRACK' });
  }, [send]);

  const onNext = useCallback(() => {
    send({ type: 'NEXT_TRACK' });
  }, [send]);

  const onSwitchMode = useCallback(() => {
    send({ type: 'NEXT_MODE' });
  }, [send]);

  const onSetMode = useCallback(
    (mode: PlayerModeState) => {
      send({ type: 'SET_MODE', mode });
    },
    [send],
  );

  const onSetTrackAndPlay = useCallback(
    (tracks: PlayerTrack[]) => {
      send({ type: 'SET_TRACKS', tracks });
      send({ type: 'PLAY' });
    },
    [send],
  );

  const value = useMemo<PlayerContextType>(
    () => ({
      audio: audio.current,

      context: state.context,

      mode,

      isPlaying,
      isPaused,

      canPlay,

      onTogglePlay,
      onPlay,
      onPause,
      onStop,
      onPrev,
      onNext,

      onSwitchMode,
      onSetMode,

      onSetTrackAndPlay,
    }),
    [
      canPlay,
      isPaused,
      isPlaying,
      mode,
      onNext,
      onPause,
      onPlay,
      onPrev,
      onSetMode,
      onSetTrackAndPlay,
      onStop,
      onSwitchMode,
      onTogglePlay,
      state.context,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};
