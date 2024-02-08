import useIsomorphicLayoutEffect from './useIsomorphicLayoutEffect';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useEvent<T extends (...args: any[]) => void>(
  handler: T,
) {
  const ref = useRef(handler);

  useIsomorphicLayoutEffect(() => {
    ref.current = handler;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(((...args) => ref.current.apply(null, args)) as T, []);
}
