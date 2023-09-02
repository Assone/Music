// eslint-disable-next-line import/prefer-default-export
export const noop = () => {};

export const arraify = <T>(target: T | T[]): T[] =>
  Array.isArray(target) ? target : [target];
