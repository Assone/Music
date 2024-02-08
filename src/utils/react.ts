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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const attachPropertiesToComponent = <C, P extends Record<string, any>>(
  component: C,
  properties: P,
): C & P => {
  const ref = component;
  const keys = Object.keys(properties);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]!;

    if (Object.prototype.hasOwnProperty.call(properties, key)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ref[key as keyof C] = properties[key];
    }
  }

  return ref as C & P;
};
