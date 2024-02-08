import { noop } from '@/utils/helpers';
import { unRef, type MaybeRef } from '@/utils/react';
import useEffectWithTarget from './useEffectWithTarget';

type Direction = 'vertical' | 'horizontal';

function getDirection(x: number, y: number): Direction | undefined {
  if (x > y) {
    return 'horizontal';
  }

  return undefined;
}

export default function useTouch(target: HTMLElement | MaybeRef<HTMLElement>) {
  const [isTouching, setIsTouching] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [deltaY, setDeltaY] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [direction, setDirection] = useState<Direction>();

  const isVertical = useMemo(() => direction === 'vertical', [direction]);
  const isHorizontal = useMemo(() => direction === 'horizontal', [direction]);

  const reset = useCallback(() => {
    setDeltaX(0);
    setDeltaY(0);
    setOffsetX(0);
    setOffsetY(0);
    setDirection(undefined);
  }, []);

  const start = useCallback(
    (event: TouchEvent) => {
      reset();
      setIsTouching(true);

      const touch = event.touches[0]!;

      setStartX(touch.clientX);
      setStartY(touch.clientY);
    },
    [reset],
  );

  const move = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0]!;

      const currentDeltaX = (touch.clientX < 0 ? 0 : touch.clientX) - startX;
      const currentDeltaY = touch.clientY - startY;
      const currentOffsetX = Math.abs(currentDeltaX);
      const currentOffsetY = Math.abs(currentDeltaY);

      setDeltaX(currentDeltaX);
      setDeltaY(currentDeltaY);
      setOffsetX(currentOffsetX);
      setOffsetY(currentOffsetY);

      const LOCK_DIRECTION_DISTANCE = 10;
      if (
        !direction ||
        (currentOffsetX < LOCK_DIRECTION_DISTANCE &&
          currentOffsetY < LOCK_DIRECTION_DISTANCE)
      ) {
        setDirection(getDirection(currentOffsetX, currentOffsetY));
      }

      const TAP_OFFSET = 10;

      if (
        isTouching &&
        (currentOffsetX > TAP_OFFSET || currentOffsetY > TAP_OFFSET)
      ) {
        setIsTouching(false);
      }
    },
    [direction, isTouching, startX, startY],
  );

  const end = useCallback(() => {
    setIsTouching(false);
  }, []);

  useEffectWithTarget(
    () => {
      const element = unRef(target);

      if ('addEventListener' in element) {
        element.addEventListener('touchstart', start);
        element.addEventListener('touchend', end);
        element.addEventListener('touchmove', move);

        return () => {
          element.removeEventListener('touchstart', start);
          element.removeEventListener('touchend', end);
          element.removeEventListener('touchmove', move);
        };
      }

      return noop;
    },
    [],
    target,
  );

  return {
    isTouching,

    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    isVertical,
    isHorizontal,
  };
}
