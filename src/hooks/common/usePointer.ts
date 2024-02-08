import { unRef, type MaybeRef } from '@/utils/react';
import useEffectWithTarget from './useEffectWithTarget';
import useEvent from './useEvent';

type PointerType = 'mouse' | 'pen' | 'touch';

interface PointerData {
  // isCapturing: boolean;
  // isPressing: boolean;
  // isPrimary: boolean;

  type: PointerType;
  // pressure: number;
  pointerId: number;
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
  offsetX: number;
  offsetY: number;
}

interface UsePointerOptions {
  start?: (event: PointerEvent) => boolean | void;
  move?: (previous: PointerData, now: PointerData) => void;
  end?: VoidFunction;
}

export default function usePointer(
  target: HTMLElement | MaybeRef<HTMLElement>,
  options: UsePointerOptions = { start: () => true },
) {
  const maxTouchPoints = useMemo(() => navigator.maxTouchPoints, []);
  const [currentPointers, setCurrentPointers] = useState<PointerData[]>([]);

  const removePointer = useCallback(
    (pointerId: number) => {
      const index = currentPointers.findIndex(
        (pointer) => pointer.pointerId === pointerId,
      );

      if (index !== -1) {
        currentPointers.splice(index, 1);
      }

      setCurrentPointers([...currentPointers]);
    },
    [currentPointers],
  );
  const hasPointer = useCallback(
    (pointerId: number) =>
      currentPointers.some((pointer) => pointer.pointerId === pointerId),
    [currentPointers],
  );

  const start = useEvent((event: PointerEvent) => {
    if (hasPointer(event.pointerId)) return;
    if (options.start?.(event) === false) return;

    currentPointers.push({
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      deltaX: 0,
      deltaY: 0,
      offsetX: 0,
      offsetY: 0,
      type: event.pointerType as PointerType,
    });

    const element = unRef(target);
    const capturingElement =
      event.target && 'setPointerCapture' in event.target
        ? (event.target as HTMLElement)
        : element;

    capturingElement.setPointerCapture(event.pointerId);

    console.debug('start', event.pointerId);

    // eslint-disable-next-line no-use-before-define
    registerTrackListener();
  });
  const move = useEvent((event: PointerEvent) => {
    const pointer = currentPointers.find(
      (pointer) => pointer.pointerId === event.pointerId,
    );

    if (!pointer) return;

    const previous = { ...pointer };
    const { startX, startY } = pointer;
    const currentDeltaX = (event.clientX < 0 ? 0 : event.clientX) - startX;
    const currentDeltaY = event.clientY - startY;
    const currentOffsetX = Math.abs(currentDeltaX);
    const currentOffsetY = Math.abs(currentDeltaY);

    pointer.deltaX = currentDeltaX;
    pointer.deltaY = currentDeltaY;
    pointer.offsetX = currentOffsetX;
    pointer.offsetY = currentOffsetY;

    options.move?.(previous, pointer);

    setCurrentPointers([...currentPointers]);
  });
  const end = useEvent((event: PointerEvent) => {
    removePointer(event.pointerId);
    if (currentPointers.length !== 0) return;

    // eslint-disable-next-line no-use-before-define
    unRegisterTrackListener();
    options.end?.();
  });
  const cancel = useEvent((event: PointerEvent) => {
    removePointer(event.pointerId);
    if (currentPointers.length !== 0) return;

    // eslint-disable-next-line no-use-before-define
    unRegisterTrackListener();
  });
  const enter = useEvent((event: PointerEvent) => {
    console.debug('enter', event.pointerId);
  });
  const leave = useEvent((event: PointerEvent) => {
    console.debug('leave', event.pointerId);
  });
  const over = useEvent((event: PointerEvent) => {
    console.debug('over', event.pointerId);
  });
  const out = useEvent((event: PointerEvent) => {
    console.debug('out', event.pointerId);
  });
  const gotCapture = useEvent((event: PointerEvent) => {
    console.debug('gotCapture', event.pointerId);
  });
  const lostCapture = useEvent((event: PointerEvent) => {
    console.debug('lostCapture', event.pointerId);
  });

  const registerTrackListener = () => {
    const element = unRef(target);

    element.addEventListener('pointermove', move);
    element.addEventListener('pointerup', end);
    element.addEventListener('pointercancel', cancel);
  };

  const unRegisterTrackListener = () => {
    const element = unRef(target);

    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerup', end);
    element.removeEventListener('pointercancel', cancel);
  };

  useEffectWithTarget(
    () => {
      const element = unRef(target);

      element.addEventListener('pointerdown', start);
      element.addEventListener('pointerenter', enter);
      element.addEventListener('pointerleave', leave);
      element.addEventListener('pointerover', over);
      element.addEventListener('pointerout', out);
      element.addEventListener('gotpointercapture', gotCapture);
      element.addEventListener('lostpointercapture', lostCapture);

      return () => {
        element.removeEventListener('pointerdown', start);
        element.removeEventListener('pointerenter', enter);
        element.removeEventListener('pointerleave', leave);
        element.removeEventListener('pointerover', over);
        element.removeEventListener('pointerout', out);
        element.removeEventListener('gotpointercapture', gotCapture);
        element.removeEventListener('lostpointercapture', lostCapture);
      };
    },
    [],
    target,
  );

  return {
    maxTouchPoints,

    currentPointers,
  };
}
