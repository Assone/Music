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

  return (
    <div className="flex h-full flex-col gap-2">
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={(e) => {
          audio.currentTime = Number(e.target.value);
        }}
      />

      <div className="flex items-center">
        <div className="flex-1 flex-col">
          <div className="truncate">{context?.currentTrack?.name}</div>
        </div>

        <div className="flex gap-2 items-center">
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
    </div>
  );
};

export default Player;
