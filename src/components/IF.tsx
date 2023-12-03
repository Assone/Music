import { PropsWithChildren } from 'react';

interface IFProps {
  condition: boolean;
  fallback?: React.ReactNode;
}

const IF: React.FC<PropsWithChildren<IFProps>> = ({
  condition,
  children,
  fallback = null,
}) => (condition ? children : fallback);

export default IF;
