import { noop } from '@/utils/helpers';
import { unRef, type MaybeRef } from '@/utils/react';
import useEffectWithTarget from './useEffectWithTarget';

export default function useDrag(target: Element | MaybeRef<Element>) {
  const [isDragging, setIsDragging] = useState(false);

  useEffectWithTarget(
    () => {
      const element = unRef(target);

      if ('addEventListener' in element) {
        const handleDragStart = () => setIsDragging(true);
        const handleDragEnd = () => setIsDragging(false);

        element.setAttribute('draggable', 'true');

        element.addEventListener('dragstart', handleDragStart);
        element.addEventListener('dragend', handleDragEnd);

        return () => {
          element.removeEventListener('dragstart', handleDragStart);
          element.removeEventListener('dragend', handleDragEnd);
        };
      }

      return noop;
    },
    [],
    target,
  );

  return {
    isDragging,
  };
}
