import { PlayerVariants } from '@/utils/variants';
import { AnimatePresence, m } from 'framer-motion';

const Image = lazy(() => import('@/components/Image'));

// million-ignore
const Player: React.FC = () => {
  const {
    audio,

    context,

    isPlaying,

    onPlay,
    onPause,
    onNext,
    onPrev,
    onStop,
  } = usePlayer();
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const onDurationChange = () => {
      setDuration(audio.duration);
    };
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [audio]);

  useEffect(() => {
    const onBeforeUnload = () => {
      if (isPlaying) {
        audio.pause();
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [audio, isPlaying]);

  return (
    <AnimatePresence>
      <IF condition={context.currentTrack !== undefined}>
        <m.div
          key="player"
          className="flex h-full flex-col gap-2 z-10"
          variants={PlayerVariants}
          initial="hidden"
          animate="show"
          transition={{ ease: 'linear', duration: 0.5 }}
        >
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => {
              audio.currentTime = Number(e.target.value);
            }}
          />

          <div className="flex items-center px-2 py-1 w-full">
            <div className="flex-1 flex gap-2 items-center">
              <Image
                src={context.currentTrack?.cover}
                className="w-10 h-10 rounded shrink-0"
              />
              <div className="flex flex-col">
                <Typography.Text className="font-bold">
                  {context?.currentTrack?.name}
                </Typography.Text>
                <Typography.Text className="text-sm dark:text-neutral-400">
                  {context?.currentTrack?.artist}
                </Typography.Text>
              </div>
            </div>

            <div className="flex gap-2 items-center flex-shrink-0">
              <IF
                condition={isPlaying}
                fallback={<IconFluentEmojiPlayButton onClick={onPlay} />}
              >
                <IconFluentEmojiPauseButton onClick={onPause} />
              </IF>
              <IconFluentEmojiStopButton onClick={onStop} />
              <IconFluentEmojiFastReverseButton onClick={onPrev} />
              <IconFluentEmojiFastForwardButton onClick={onNext} />
            </div>
          </div>
        </m.div>
      </IF>
    </AnimatePresence>
  );
};

export default Player;
