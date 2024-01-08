import { useEffect, type DependencyList } from "react";

export default function useAsyncEffect(
  effect: () => Promise<void>,
  deps?: DependencyList | undefined,
) {
  useEffect(() => {
    const promise = effect();

    const execute = async () => {
      await promise;
    };

    execute().catch((error) => {
      console.error("[useAsyncEffect]", error);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
