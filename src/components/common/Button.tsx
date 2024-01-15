import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  className,
  type = 'button',
  ...props
}) => (
  <button
    className={classNames('flex items-center justify-start gap-1', className)}
    // eslint-disable-next-line react/button-has-type
    type={type}
    {...props}
  >
    {children}
  </button>
);

export default Button;
