import { UseStorageOptions, UseStorageReturn } from './useStorage';

export function useLocalStorage(
  key: string,
  initialValue: string,
  options?: UseStorageOptions<string>,
): UseStorageReturn<string>;
export function useLocalStorage(
  key: string,
  initialValue: number,
  options?: UseStorageOptions<number>,
): UseStorageReturn<number>;
export function useLocalStorage(
  key: string,
  initialValue: boolean,
  options?: UseStorageOptions<boolean>,
): UseStorageReturn<boolean>;
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseStorageOptions<T>,
): UseStorageReturn<T>;
export function useLocalStorage<T = unknown>(
  key: string,
  initialValue: T,
  options?: UseStorageOptions<T>,
): UseStorageReturn<T>;
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseStorageOptions<T> = {},
): UseStorageReturn<T> {
  const { window } = options;

  return useStorage<T>(key, initialValue, window?.localStorage, options);
}
