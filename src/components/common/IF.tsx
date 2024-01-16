import type { PropsWithChildren, ReactNode } from 'react';

export interface IFProps {
  condition: boolean;
  fallback?: ReactNode;
}

const IF: React.FC<PropsWithChildren<IFProps>> = ({
  condition,
  children,
  fallback,
}) => (condition ? children : fallback);

// eslint-disable-next-line react-refresh/only-export-components
export default IF;
