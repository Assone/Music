import { PropsWithChildren, useMemo } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  target: string;
  key?: string;
}

const Portal: React.FC<PropsWithChildren<PortalProps>> = ({
  target,
  children,
  key,
}) => {
  const element = useMemo(() => document.querySelector(target), [target]);

  if (!element) {
    console.error(
      `[Component Error: Portal] Target element not found [${target}]`,
    );

    return null;
  }

  return createPortal(children, element, key);
};

export default Portal;
