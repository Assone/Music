import { useDebugValue, useEffect, useState } from 'react';

export default function useSupported(predicate: () => boolean) {
  const [isSupported, setIsSupported] = useState(false);

  useDebugValue(isSupported ? 'Supported' : 'Not supported');

  useEffect(() => {
    setIsSupported(predicate());
  }, [predicate]);

  return isSupported;
}
