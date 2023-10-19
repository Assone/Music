import { isNumber } from '@/utils/is';
import { CSSProperties, useMemo } from 'react';
import stylex from '@stylexjs/stylex';
import { UserAuthoredStyles } from '@stylexjs/stylex/lib/StyleXTypes';

type Breakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

type BreakpointSizeOptionsKeys = 'width' | 'height' | 'size';

type BreakpointOptionsType =
  | number
  | Partial<Record<BreakpointSizeOptionsKeys, number> & { media?: string }>;

type BreakpointOptions = Partial<Record<Breakpoints, BreakpointOptionsType>>;

type FormatSourceOptions = {
  breakpoint: Breakpoints;
  width?: number;
  height?: number;
  size?: number;
};

type FormatSourceCallback = (
  source: string,
  options: FormatSourceOptions,
) => string;

interface MediaConditionSourceOptions {
  breakpoints?: BreakpointOptions;
  formatSource?: FormatSourceCallback;
}

const defaultBreakpoints: BreakpointOptions = {
  xs: {
    size: 384,
    media: '(max-width: 639px)',
  },
  sm: {
    size: 640,
    media: '(min-width: 640px) and (max-width: 767px)',
  },
  md: {
    size: 768,
    media: '(min-width: 768px) and (max-width: 1023px)',
  },
  lg: {
    size: 1024,
    media: '(min-width: 1024px) and (max-width: 1279px)',
  },
  xl: {
    size: 1280,
    media: '(min-width: 1280px) and (max-width: 1535px)',
  },
  xxl: {
    size: 1536,
    media: '(min-width: 1536px)',
  },
};

const defaultFormatSource: FormatSourceCallback = (source, options) => {
  const { width, height, size } = options;

  if (width && height) {
    return `${source}?param=${width}y${height}`;
  }
  if (size) {
    return `${source}?param=${size}y${size}`;
  }

  return source;
};

const generationMediaQueries = (width: number, nextWidth?: number) => {
  if (nextWidth) {
    return `(min-width: ${width}px) and (max-width: ${nextWidth - 1}px)`;
  }

  return `(min-width: ${width}px)`;
};

const getBreakpointSizeOptionValue = (
  options?: BreakpointOptionsType,
  key: BreakpointSizeOptionsKeys = 'size',
) => (isNumber(options) ? options : options?.[key] || options?.size || 0);

type GetMediaQueriesFn = (data: {
  url?: string | undefined;
  media: string;
}) => CSSProperties;

export default function useGenerateResponsiveResources(
  source?: string,
  {
    breakpoints = defaultBreakpoints,
    formatSource = defaultFormatSource,
  }: MediaConditionSourceOptions = {},
) {
  const result = useMemo(
    () =>
      Object.entries(breakpoints).reduce(
        (acc, [breakpoint, options], index, list) => {
          const key = breakpoint as Breakpoints;
          const [, nextOptions] = list[index + 1] || [];
          const nextWidth = getBreakpointSizeOptionValue(nextOptions, 'width');

          const width = getBreakpointSizeOptionValue(options, 'width');
          const height = getBreakpointSizeOptionValue(options, 'height');
          const size = getBreakpointSizeOptionValue(options, 'size');

          const url = source
            ? formatSource(source, {
                breakpoint: key,
                width,
                height,
                size,
              })
            : undefined;
          const media = isNumber(options)
            ? generationMediaQueries(width, nextWidth)
            : options.media;

          return { ...acc, [key]: { url, media } };
        },
        {} as Record<Breakpoints, { url?: string; media: string }>,
      ),
    [breakpoints, formatSource, source],
  );

  const list = useMemo(
    () =>
      Object.entries(result).map(([breakpoint, { url, media }]) => ({
        breakpoint: breakpoint as Breakpoints,
        url,
        media,
      })),
    [result],
  );

  const generateMediaQueriesClass = (content: GetMediaQueriesFn) => {
    const data = list.reduce((pre, { media, url }) => {
      const properties = content({ media, url });

      const values = {
        ...pre,
      };

      const keys = Object.keys(properties);

      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i] as keyof CSSProperties;
        const propertie = properties[key] as keyof UserAuthoredStyles;
        const value = values[key];

        if (value) {
          values[key] = {
            ...value,
            [`@media ${media}`]: propertie,
          };
        } else {
          values[key] = {
            [`@media ${media}`]: propertie,
          };
        }
      }

      return values;
    }, {} as UserAuthoredStyles);

    // eslint-disable-next-line @stylexjs/valid-styles
    const style = stylex.create({ base: data });

    return stylex(style.base);
  };

  return {
    ...result,
    list,
    generateMediaQueriesClass,
  };
}
