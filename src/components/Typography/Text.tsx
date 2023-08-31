import { HTMLAttributes, PropsWithChildren } from 'react';

export interface TextProps extends HTMLAttributes<HTMLElement> {}

const Text: React.FC<PropsWithChildren<TextProps>> = ({
  children,
  ...props
}) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <span {...props} className="text-black dark:text-white">
    {children}
  </span>
);

export default Text;
