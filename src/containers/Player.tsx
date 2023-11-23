// million-ignore
const Player: React.FC = () => {
  const {
    audio,

    context: data,

    isPlaying,

    onPlay,
    onPause,
    onNext,
    onPrev,
    onStop,
    onSwitchMode,
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
    <div className="sticky bottom-16 flex gap-2 bg-slate-500">
      <div className="flex-1 flex-col">
        <div className="truncate">{data?.currentTrack?.name}</div>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => {
            audio.currentTime = Number(e.target.value);
          }}
        />
      </div>

      {isPlaying ? (
        <IconFluentEmojiPauseButton onClick={onPause} />
      ) : (
        <IconFluentEmojiPlayButton onClick={onPlay} />
      )}
      <IconFluentEmojiStopButton onClick={onStop} />
      <IconFluentEmojiFastReverseButton onClick={onPrev} />
      <IconFluentEmojiFastForwardButton onClick={onNext} />
      <button type="button" onClick={onSwitchMode}>
        Mode
      </button>
    </div>
  );
};

export default Player;
