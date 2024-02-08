/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { isFunction } from '@/utils/is';
import type { KeyboardEvent } from 'react';

type KeyName =
  | `Meta_${string}`
  | `Alt_${string}`
  | `Ctrl_${string}`
  | `Shift_${string}`
  | string;

type CombinationKey = 'Meta' | 'Alt' | 'Ctrl' | 'Shift';

type CombinationKeyState = Record<
  `${Uncapitalize<CombinationKey>}Key`,
  boolean
>;

interface KeyConfig {
  callback?: <T>(event: KeyboardEvent<T>) => void;
  while?: (() => boolean) | boolean;
}

export type KeyMap = {
  [key in KeyName]?: KeyConfig;
};

interface Shortcut extends CombinationKeyState, KeyConfig {
  key: string;
}

export default function useKeyboardEvent<T = Element>(keyMaps: KeyMap = {}) {
  const shortcuts = useMemo(() => {
    const list: Shortcut[] = [];
    const keys = Object.keys(keyMaps);

    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i]!;
      const config = keyMaps[key];
      const split = key.split('_');

      const shortcut: Shortcut = {
        key: split
          .filter((k) => !['Meta', 'Alt', 'Ctrl', 'Shift'].includes(k))
          .join('_'),
        metaKey: split.includes('Meta'),
        altKey: split.includes('Alt'),
        ctrlKey: split.includes('Ctrl'),
        shiftKey: split.includes('Shift'),
        ...config,
      };

      list.push(shortcut);
    }

    return list;
  }, [keyMaps]);

  const listener = useCallback(
    (event: KeyboardEvent<T>) => {
      const { metaKey, shiftKey, altKey, ctrlKey, key } = event;

      for (let i = 0; i < shortcuts.length; i += 1) {
        const shortcut = shortcuts[i]!;
        const { key: shortcutKey, callback } = shortcut;
        const condition = shortcut.while ?? true;
        const shouldTrigger = isFunction(condition) ? condition() : condition;

        if (
          shouldTrigger &&
          key === shortcutKey &&
          metaKey === shortcut.metaKey &&
          shiftKey === shortcut.shiftKey &&
          altKey === shortcut.altKey &&
          ctrlKey === shortcut.ctrlKey
        ) {
          event.preventDefault();
          event.stopPropagation();

          callback?.(event);
          break;
        }
      }
    },
    [shortcuts],
  );

  return listener;
}
