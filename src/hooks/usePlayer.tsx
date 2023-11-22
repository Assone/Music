import player, {
  PlayerMachineContext,
  PlayerTrackData,
} from '@/player.machine';
import { useMachine } from '@xstate/react';
import { PropsWithChildren, createContext } from 'react';

interface PlayerContextType {
  audio: HTMLAudioElement;

  data: PlayerMachineContext;

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
  onSetTrackAndPlay: (tracks: PlayerTrackData[]) => void;
}

const PlayerContext = createContext<PlayerContextType>(null!);

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, send, service] = useMachine(player, { devTools: true });
  const audio = useRef(new Audio());

  useEffect(() => {
    const subscription = service.subscribe((state) => {
      if (
        state.matches('track.playing') &&
        state.context.currentTrackSourceInfo
      ) {
        audio.current.src = state.context.currentTrackSourceInfo.url;
        audio.current
          .play()
          .catch((err) => console.error('[Player Audio Play Error]', err));
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [service]);

  useEffect(() => {
    const onEnded = () => {
      send({ type: 'NEXT_TRACK' });
    };

    audio.current.addEventListener('ended', onEnded);

    return () => {
      audio.current.removeEventListener('ended', onEnded);
    };
  });

  const isPlaying = state.matches('track.playing');
  const isPaused = state.matches('track.paused');
  const canPlay = state.context.currentTrackSourceInfo !== null;

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

  const onSetTrackAndPlay = useCallback(
    (tracks: PlayerTrackData[]) => {
      send({ type: 'SET_TRACKS', tracks });
      send({ type: 'PLAY' });
    },
    [send],
  );

  const value = useMemo<PlayerContextType>(
    () => ({
      audio: audio.current,

      data: state.context,

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
      onSetTrackAndPlay,
    }),
    [
      canPlay,
      isPaused,
      isPlaying,
      onNext,
      onPause,
      onPlay,
      onPrev,
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
