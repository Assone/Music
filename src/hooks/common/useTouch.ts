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
    setIsTouching(true);
  }, []);

  const start = useCallback(
    (event: TouchEvent) => {
      reset();

      const touch = event.touches[0]!;

      setStartX(touch.clientX);
      setStartY(touch.clientY);
    },
    [reset],
  );

  const move = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0]!;
      setDeltaX((touch.clientX < 0 ? 0 : touch.clientX) - startX);
      setDeltaY(touch.clientY - startY);
      setOffsetX(Math.abs(deltaX));
      setOffsetY(Math.abs(deltaY));

      const LOCK_DIRECTION_DISTANCE = 10;
      if (
        !direction ||
        (offsetX < LOCK_DIRECTION_DISTANCE && offsetY < LOCK_DIRECTION_DISTANCE)
      ) {
        setDirection(getDirection(offsetX, offsetY));
      }

      const TAP_OFFSET = 10;

      if (isTouching && (offsetX > TAP_OFFSET || offsetY > TAP_OFFSET)) {
        setIsTouching(false);
      }
    },
    [deltaX, deltaY, direction, isTouching, offsetX, offsetY, startX, startY],
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
