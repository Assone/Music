import classNames from 'classnames';
import type { HTMLAttributes, PropsWithChildren } from 'react';

export interface TextProps extends HTMLAttributes<HTMLElement> {}

const Text: React.FC<PropsWithChildren<TextProps>> = ({
  children,

  className,
  ...props
}) => (
  <span
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    className={classNames('text-sm text-black dark:text-white', className)}
  >
    {children}
  </span>
);

export default Text;
