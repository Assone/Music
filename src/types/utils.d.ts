/* eslint-disable @typescript-eslint/no-explicit-any */
export type ArrayItem<T> = T extends Array<infer U> ? U : never;

type UnionToIntersection<U> = (
  U extends never ? never : (arg: U) => never
) extends (arg: infer I) => void
  ? I
  : never;

export type UnionToTuple<T> = UnionToIntersection<
  T extends never ? never : (t: T) => T
> extends (_: never) => infer W
  ? [...UnionToTuple<Exclude<T, W>>, W]
  : [];

export type Difference<
  T extends readonly any[],
  U extends readonly any[],
> = T extends []
  ? []
  : T extends [infer First, ...infer Rest]
  ? First extends U[number]
    ? Difference<Rest, U>
    : [First, ...Difference<Rest, U>]
  : T;

export type AnyFn = (...args: any[]) => any;
