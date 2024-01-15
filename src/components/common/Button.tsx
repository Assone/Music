import type { PropsWithChildren } from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  type = 'button',
  ...props
}) => (
  <button
    className='flex items-center justify-start gap-1'
    // eslint-disable-next-line react/button-has-type
    type={type}
    {...props}
  >
    {children}
  </button>
);

export default Button;
