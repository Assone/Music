import { map, type OperatorFunction } from 'rxjs';

// eslint-disable-next-line import/prefer-default-export
export const mapArray = <T, R>(
  mapFn: (item: T, index: number) => R,
): OperatorFunction<T[], R[]> => map((list: T[]) => list.map(mapFn));
