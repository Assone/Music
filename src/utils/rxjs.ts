import { map, type OperatorFunction } from 'rxjs';

export const mapArray = <T, R>(
  mapFn: (item: T, index: number) => R,
): OperatorFunction<T[], R[]> => map((list: T[]) => list.map(mapFn));
