import { isArray } from './is';

export const noop = () => {};

export const arraify = <T>(target: T | T[]): T[] =>
  isArray(target) ? target : [target];
