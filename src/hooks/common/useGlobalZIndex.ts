let zIndex = 1000;

export default function useGlobalZIndex() {
  const index = useMemo(() => {
    zIndex += 1;
    return zIndex;
  }, []);

  return index;
}

export const getGlobalIndex = () => zIndex;
