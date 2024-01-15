import { noop } from '@/utils/helpers';
import useSupported from './useSupported';

export interface useMediaQueryProps {
  query: string;
}

export function useMediaQuery({ query }: useMediaQueryProps) {
  const isSupported = useSupported(
    () =>
      window &&
      'matchMedia' in window &&
      typeof window.matchMedia === 'function',
  );
  const mediaQuery = useRef<MediaQueryList | null>(null);
  const [matches, setMatches] = useState(false);

  useDebugValue(matches ? 'Matches' : 'Does not match');

  useEffect(() => {
    if (!isSupported) {
      return noop;
    }

    mediaQuery.current = window.matchMedia(query);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (!mediaQuery.current) {
      return noop;
    }

    if ('addEventListener' in mediaQuery.current) {
      mediaQuery.current.addEventListener('change', listener);
      setMatches(mediaQuery.current.matches);

      return () => mediaQuery.current!.removeEventListener('change', listener);
    }

    return noop;
  }, [isSupported, query]);

  return matches;
}
