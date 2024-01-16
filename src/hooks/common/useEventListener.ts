import type { Arrayable, Fn } from '@/types/utils';
import { arraify, noop } from '@/utils/helpers';
import { unRef, type MaybeRef } from '@/utils/react';
import { useEffect, useRef, useState } from 'react';

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

export function useEventListener<N extends WindowEventName>(
  event: Arrayable<N>,
  listener: Arrayable<(this: Window, evt: WindowEventMap[N]) => unknown>,
  options?: EventListenerOptions,
): Fn;
export function useEventListener<N extends WindowEventName>(
  target: Window,
  event: Arrayable<N>,
  listener: Arrayable<(this: Window, evt: WindowEventMap[N]) => unknown>,
  options?: EventListenerOptions,
): Fn;
export function useEventListener<N extends DocumentEventName>(
  target: DocumentOrShadowRoot,
  event: Arrayable<N>,
  listener: Arrayable<(this: Document, evt: DocumentEventMap[N]) => unknown>,
  options?: EventListenerOptions,
): Fn;
export function useEventListener<N extends HTMLElementEventName>(
  target: MaybeRef<HTMLElement | undefined>,
  event: Arrayable<N>,
  listener: (this: HTMLElement, evt: HTMLElementEventMap[N]) => unknown,
  options?: EventListenerOptions,
): Fn;
export function useEventListener<N extends string, EventType = Event>(
  target: InferEventTarget<N>,
  event: Arrayable<N>,
  listener: Arrayable<GeneralEventListener<EventType>>,
  options?: EventListenerOptions,
): Fn;
export function useEventListener<EventType = Event>(
  target: MaybeRef<EventTarget | undefined>,
  event: Arrayable<string>,
  listener: Arrayable<GeneralEventListener<EventType>>,
  options?: EventListenerOptions,
): Fn;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useEventListener(...args: any[]) {
  const [shouldListener, setShouldListener] = useState(true);
  const cleanups = useRef<Fn[]>([]);

  let target: EventTarget;
  let events: string[] = [];
  let listeners: Fn[];
  let options: EventListenerOptions;

  if (typeof args[0] === 'string' || Array.isArray(args[0])) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    [events as unknown, listeners, options] = args;
    target = window;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    [target, events, listeners, options] = args;
  }

  events = arraify(events);
  listeners = arraify(listeners);

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
    cleanups.current.forEach((fn) => fn());
    cleanups.current.length = 0;
  };

  const stop = () => {
    setShouldListener(false);
    cleanup();
  };

  useEffect(() => {
    if (shouldListener) {
      const element = unRef(target);

      if (!element) return noop;

      cleanup();

      cleanups.current = events.flatMap((evtName) =>
        listeners.map((listener) =>
          register(element, evtName, listener, options),
        ),
      );

      return cleanup;
    }

    return noop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, shouldListener, target]);

  return stop;
}
