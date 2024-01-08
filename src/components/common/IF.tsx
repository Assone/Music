import { PropsWithChildren, ReactNode } from "react";

export interface IFProps {
  condition: boolean;
  fallback?: ReactNode;
}

const IF: React.FC<PropsWithChildren<IFProps>> = ({
  condition,
  children,
  fallback,
}) => (condition ? children : fallback);

export default IF;
