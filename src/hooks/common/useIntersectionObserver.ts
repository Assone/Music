import { noop } from '@/utils/helpers';
import { isArray, notNullish } from '@/utils/is';
import useSupported from './useSupported';

interface UseIntersectionObserverOptions {
  immediate?: boolean;
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | Document | null;
}

export default function useIntersectionObserver(
  target: (HTMLElement | null)[] | HTMLElement | HTMLElement[] | null,
  callback: IntersectionObserverCallback,
  options: UseIntersectionObserverOptions = {},
) {
  const {
    immediate = true,
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
  } = options;
  const [isActive, setIsActive] = useState(immediate);
  const isSupported = useSupported(
    () => window && 'IntersectionObserver' in window,
  );
  const clean = useRef(noop);
  const targets = useMemo<HTMLElement[]>(() => {
    const list = isArray(target) ? target : [target];

    return list.filter(notNullish);
  }, [target]);

  useEffect(() => {
    if (!isSupported) return noop;

    clean.current();

    if (!isActive || !targets.length) return noop;

    const observer = new IntersectionObserver(callback, {
      threshold,
      root,
      rootMargin,
    });

    targets.forEach((t) => observer.observe(t));

    clean.current = () => {
      observer.disconnect();
      clean.current = noop;
    };

    return () => {
      clean.current();
    };
  }, [callback, isActive, isSupported, root, rootMargin, targets, threshold]);

  const stop = useCallback(() => {
    clean.current();
    setIsActive(false);
  }, []);

  const pause = useCallback(() => {
    clean.current();
    setIsActive(false);
  }, []);

  const resume = useCallback(() => {
    setIsActive(true);
  }, []);

  return {
    isSupported,
    isActive,
    stop,
    pause,
    resume,
  };
}
