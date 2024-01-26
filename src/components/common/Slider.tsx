import useTouch from '@/hooks/common/useTouch';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
}

const Slider: React.FC<SliderProps> = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,
}) => {
  const percentage = useMemo(
    () => ((value - min) / (max - min)) * 100,
    [max, min, value],
  );

  const thumb = useRef<HTMLButtonElement>(null!);

  const touchData = useTouch(thumb);

  console.debug(step, touchData);

  return (
    <div className='relative h-2 rounded bg-neutral-200'>
      <div
        className='h-full rounded bg-neutral-500'
        style={{ width: `${percentage}%` }}
      />
      <button
        ref={thumb}
        type='button'
        className='absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500'
        style={{ left: `${percentage}%` }}
        aria-label='Drag to seek'
      />
    </div>
  );
};

export default Slider;
