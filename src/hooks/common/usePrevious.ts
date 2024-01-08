import { useRef } from "react";

type DetermineUpdateFn<T> = (prev: T | undefined, next: T) => boolean;

export default function usePrevious<T>(
  state: T,
  determineUpdateFn: DetermineUpdateFn<T> = (prev, next) =>
    !Object.is(prev, next),
) {
  const ref = useRef<T>();

  if (determineUpdateFn(ref.current, state)) {
    ref.current = state;
  }

  return ref.current;
}
