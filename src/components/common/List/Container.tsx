import { isFunction } from '@/utils/is';
import type { ReactNode } from 'react';

export interface ListContainerProps<T> {
  source?: T[];
  children?: ((data: T, index: number) => ReactNode) | ReactNode;
}

const ListContainer = <T,>({
  source,
  children: slot,
}: ListContainerProps<T>) => {
  const render = () =>
    isFunction(slot) ? source?.map((data, index) => slot(data, index)) : slot;

  return <div>{render()}</div>;
};

export default ListContainer;
