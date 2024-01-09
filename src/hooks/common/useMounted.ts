import { useEffect } from 'react';

export default function useMounted(callback: VoidFunction) {
  useEffect(() => {
    callback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
