import type { Fn } from '@/types/utils';
import { noop } from '@/utils/helpers';
import { isArray } from '@/utils/is';
import useLatest from './useLatest';
import usePrevious from './usePrevious';

type WatchCallback<T> =
  | ((source: T, prevSource: T) => void)
  | ((source: T, prevSource: T) => Fn);

interface WatchOptions {
  immediate?: boolean;
}

export default function useWatch<const T extends readonly unknown[]>(
  source: T,
  callback: WatchCallback<T>,
  options?: WatchOptions,
): Fn;
export default function useWatch<T>(
  source: T,
  callback: WatchCallback<T>,
  options?: WatchOptions,
): Fn;
export default function useWatch<T>(
  source: T,
  callback: WatchCallback<T>,
  options: WatchOptions = {},
): Fn {
  const { immediate = true } = options;
  const active = useRef(immediate);
  const prevSource = usePrevious(source, (prev, next) => {
    if (isArray(prev)) {
      return prev.some(
        (item, index) => !Object.is(item, next[index as keyof typeof next]),
      );
    }

    return !Object.is(prev, next);
  });
  const effect = useLatest(callback);

  useDebugValue(active.current, (value) => `Active: ${String(value)}`);
  useDebugValue(source, (value) => `Source: ${String(value)}`);

  const stop = () => {
    active.current = false;
  };

  useEffect(() => {
    if (!active.current) return noop;

    const clean = effect.current(source, prevSource);

    return () => {
      clean?.();
    };
  }, [effect, prevSource, source]);

  return stop;
}
