import { useRef } from 'react';

type DetermineUpdateFn<T> = (prev: T | undefined, current: T) => boolean;

export default function usePrevious<T>(
  state: T,
  determineUpdateFn: DetermineUpdateFn<T> = (prev, next) =>
    !Object.is(prev, next),
) {
  const currentRef = useRef<T>(state);
  const previousRef = useRef<T>(state);

  if (determineUpdateFn(currentRef.current, state)) {
    previousRef.current = currentRef.current;
    currentRef.current = state;
  }

  return previousRef.current;
}
