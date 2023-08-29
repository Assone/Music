import { RefObject } from 'react';

type TypeOfType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function';

const typeOf =
  <T>(type: TypeOfType) =>
  (value: unknown): value is T =>
    // eslint-disable-next-line valid-typeof
    typeof value === type;

const kindCache: Record<string, string> = {};

const kindOf = (value: unknown): string => {
  const type = toString.call(value);

  if (!kindCache[type]) {
    kindCache[type] = type.slice(8, -1).toLowerCase();
  }

  return kindCache[type] as string;
};

export const { isArray } = Array;

export const isString = typeOf<string>('string');

export const isNumber = typeOf<number>('number');

export const isBoolean = typeOf<boolean>('boolean');

export const isSymbol = typeOf<symbol>('symbol');

export const isUndefined = typeOf<undefined>('undefined');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isObject = (value: unknown): value is Record<keyof any, any> =>
  value !== null && kindOf(value) === 'object';

export const notNullish = <T = unknown>(val?: T | null | undefined): val is T =>
  val != null;

export const isRef = <T>(value: unknown): value is RefObject<T> =>
  isObject(value) && 'current' in value;
