import type { Fn } from '@/types/utils';
import { defaultWindow } from '@/utils/configurable';
import { noop } from '@/utils/helpers';
import { unRef, type MaybeRef } from '@/utils/react';
import { useEffect, useRef, useState } from 'react';
import useLatest from './useLatest';

type WindowEventName = keyof WindowEventMap;
type DocumentEventName = keyof DocumentEventMap;
type HTMLElementEventName = keyof HTMLElementEventMap;

type EventListenerOptions = boolean | AddEventListenerOptions;

interface GeneralEventListener<E = Event> {
  (evt: E): void;
}

interface InferEventTarget<E> {
  addEventListener(event: E, fn?: Fn, options?: EventListenerOptions): void;
  removeEventListener(event: E, fn?: Fn, options?: EventListenerOptions): void;
}

export default function useEventListener<N extends WindowEventName>(
  target: Window | undefined,
  event: N,
  listener: (this: Window, evt: WindowEventMap[N]) => unknown,
  options?: EventListenerOptions,
): Fn;
export default function useEventListener<N extends DocumentEventName>(
  target: DocumentOrShadowRoot | undefined,
  event: N,
  listener: (this: Document, evt: DocumentEventMap[N]) => unknown,
  options?: EventListenerOptions,
): Fn;
export default function useEventListener<N extends HTMLElementEventName>(
  target: HTMLElement | undefined,
  event: N,
  listener: (this: HTMLElement, evt: HTMLElementEventMap[N]) => unknown,
  options?: EventListenerOptions,
): Fn;
export default function useEventListener<N extends string, EventType = Event>(
  target: InferEventTarget<N> | undefined,
  event: N,
  listener: GeneralEventListener<EventType>,
  options?: EventListenerOptions,
): Fn;
export default function useEventListener<EventType = Event>(
  target: MaybeRef<EventTarget | undefined>,
  event: string,
  listener: GeneralEventListener<EventType>,
  options?: EventListenerOptions,
): Fn;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function useEventListener(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target: any,
  event: string,
  callback: Fn,
  options: EventListenerOptions = false,
) {
  const [shouldListener, setShouldListener] = useState(true);
  const cleanups = useRef<Fn>(noop);
  const listener = useLatest(callback);

  const register = (
    element: EventTarget,
    event: string,
    listener: Fn,
    option: EventListenerOptions,
  ) => {
    element.addEventListener(event, listener, option);

    return () => {
      element.removeEventListener(event, listener, option);
    };
  };

  const cleanup = () => {
    cleanups.current();
  };

  const stop = () => {
    setShouldListener(false);
    cleanup();
  };

  useEffect(() => {
    if (shouldListener) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const element = unRef((target as EventTarget) || defaultWindow);

      if (!element) return noop;

      cleanup();

      cleanups.current = register(element, event, listener.current, options);

      return cleanup;
    }

    return noop;
  }, [event, callback, options, shouldListener, target, listener]);

  return stop;
}
