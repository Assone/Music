import { arraify } from '@/utils/helpers';
import { unRef, type MaybeRef } from '@/utils/react';
import type { DependencyList, EffectCallback } from 'react';
import useUnMounted from './useUnMounted';

type Target = Element | MaybeRef<Element>;

const isDepsSame = (deps1: DependencyList, deps2: DependencyList) => {
  if (deps1.length !== deps2.length) {
    return false;
  }

  if (deps1 === deps2) {
    return true;
  }

  for (let i = 0; i < deps1.length; i += 1) {
    if (Object.is(deps1[i], deps2[i]) === false) {
      return false;
    }
  }

  return true;
};

export default function useEffectWithTarget(
  effect: EffectCallback,
  deps: DependencyList,
  target: Target | Target[],
) {
  const init = useRef(false);
  const targetRef = useRef<Target[]>([]);
  const depsRef = useRef(deps);
  const callbackRef = useRef<void | VoidFunction>();

  useEffect(() => {
    const targets = arraify(target).map(unRef);

    if (init.current === false) {
      init.current = true;

      targetRef.current = targets;
      depsRef.current = deps;
      callbackRef.current = effect();
    } else if (
      targets.length !== targetRef.current.length ||
      !isDepsSame(deps, depsRef.current) ||
      !isDepsSame(targets, targetRef.current)
    ) {
      callbackRef.current?.();

      targetRef.current = targets;
      depsRef.current = deps;
      callbackRef.current = effect();
    }
  });

  useUnMounted(() => {
    callbackRef.current?.();
    init.current = false;
  });
}
