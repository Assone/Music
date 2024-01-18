import { breakpointsTailwind, type Breakpoints } from './useBreakpoints';

interface UseResponsiveImageOptions {
  breakpoints?: Breakpoints;
  formatSrc?: (src: string, width: number) => string;
}

export default function useResponsiveImage(
  source?: string,
  {
    breakpoints = breakpointsTailwind,
    formatSrc = (src, width) => `${src}?param=${width}y${width}`,
  }: UseResponsiveImageOptions = {},
) {
  const srcSet = useMemo(() => {
    if (!source) return undefined;

    const srcs = Object.entries(breakpoints).map(([, width]) => {
      const src = formatSrc ? formatSrc(source, width) : source;
      return `${src} ${width}w`;
    });
    return srcs.join(', ');
  }, [breakpoints, formatSrc, source]);
  const sizes = useMemo(() => {
    const sort = Object.entries(breakpoints).sort(([, a], [, b]) => a - b);
    const sizes = sort.reduce((acc, [, width], index) => {
      const [, nextWidth] = sort[index + 1] || [];

      if (index === 0 && nextWidth) {
        return `(max-width: ${
          width - 1
        }px) ${width}px, (min-width: ${width}px) and (max-width: ${
          nextWidth - 1
        }px) ${width}px`;
      }

      if (index === sort.length - 1) {
        return `${acc}, ${width}px`;
      }

      if (nextWidth) {
        return `${acc}, (min-width: ${width}px) and (max-width: ${
          nextWidth - 1
        }px) ${width}px`;
      }

      return acc;
    }, '');

    return sizes;
  }, [breakpoints]);

  return {
    srcSet,
    sizes,
  };
}
