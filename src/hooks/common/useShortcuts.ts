import type { KeyboardEvent } from 'react';
import useEventListener from './useEventListener';
import type { KeyMap } from './useKeyboardEvent';
import useKeyboardEvent from './useKeyboardEvent';

export default function useShortcuts(keyMaps: KeyMap = {}) {
  const onKeyDown = useKeyboardEvent(keyMaps);

  useEventListener(
    import.meta.env.SSR ? undefined : window,
    'keydown',
    (evt) => {
      onKeyDown(evt as unknown as KeyboardEvent);
    },
  );
}
