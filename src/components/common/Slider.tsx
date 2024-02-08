import usePointer from '@/hooks/common/usePointer';
import { clamp } from '@/utils/number';

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;

  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  value = 0,
  min = 0,
  max = 100,
  step = 1,

  onChange,
}) => {
  const container = useRef<HTMLDivElement>(null!);
  const thumb = useRef<HTMLButtonElement>(null!);

  const [dragValue, setDragValue] = useState(value);
  const scope = useMemo(() => max - min, [max, min]);

  const { currentPointers } = usePointer(thumb, {
    start: () => !(currentPointers.length > 1),
    move: (prev) => {
      const rect = container.current.getBoundingClientRect();

      const delta = prev.deltaX;
      const total = rect.width;
      const diff = (delta / total) * scope;
      const value = Math.round((clamp(diff, min, max) - min) / step) * step;

      setDragValue(Math.round((value / scope) * 100));
    },
    end: () => {
      onChange?.(dragValue);
    },
  });
  const isDragging = useMemo(
    () => currentPointers.length > 0,
    [currentPointers.length],
  );

  const width = useMemo(
    () => ((value - min) / (max - min)) * 100,
    [max, min, value],
  );
  const percentage = useMemo(() => {
    if (isDragging) {
      return dragValue;
    }

    return width;
  }, [dragValue, isDragging, width]);

  return (
    <div className='relative h-10 rounded bg-neutral-200' ref={container}>
      <div
        className='h-full rounded bg-neutral-500'
        style={{ width: `${width}%` }}
      />
      <button
        ref={thumb}
        type='button'
        className='absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full bg-green-500'
        style={{
          left: `${percentage}%`,
        }}
        aria-label='Drag to seek'
      />
    </div>
  );
};

export default Slider;
