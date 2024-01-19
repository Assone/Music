import type { DOMAttributes, MutableRefObject, ReactElement } from 'react';
import { cloneElement } from 'react';
import { isObject } from './is';

export type MaybeRef<T> = T | MutableRefObject<T>;

export const isRef = <T>(value: unknown): value is MutableRefObject<T> =>
  isObject(value) && 'current' in value;

export const unRef = <T>(value: MaybeRef<T>) =>
  isRef(value) ? value.current : value;

export type PropagationEvent = keyof Omit<
  DOMAttributes<HTMLElement>,
  'children' | 'dangerouslySetInnerHTML'
>;

export const withStopPropagation = (
  events: PropagationEvent[],
  element: ReactElement,
) => {
  const props: Record<string, unknown> = {
    ...(element.props as Record<string, unknown>),
  };

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];

    if (event) {
      const handler = props[event] as (event: Event) => void;

      props[event] = (event: Event) => {
        event.stopPropagation();
        handler?.(event);
      };
    }
  }

  return cloneElement(element, props);
};
