export type Breakpoints<K extends string = string> = Record<K, number>;

export const breakpointsTailwind: Breakpoints<
  'sm' | 'md' | 'lg' | 'xl' | '2xl'
> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
