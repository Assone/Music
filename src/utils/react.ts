import type { MutableRefObject } from 'react';
import { isObject } from './is';

export type MaybeRef<T> = T | MutableRefObject<T>;

export const isRef = <T>(value: unknown): value is MutableRefObject<T> =>
  isObject(value) && 'current' in value;

export const unRef = <T>(value: MaybeRef<T>) =>
  isRef(value) ? value.current : value;
