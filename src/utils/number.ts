// eslint-disable-next-line import/prefer-default-export
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);
