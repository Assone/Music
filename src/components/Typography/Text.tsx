import { cx } from '@emotion/css';
import { HTMLAttributes, PropsWithChildren } from 'react';

export interface TextProps extends HTMLAttributes<HTMLElement> {}

const Text: React.FC<PropsWithChildren<TextProps>> = ({
  children,
  ...props
}) => (
  <span
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    className={cx('text-black dark:text-white', props.className)}
  >
    {children}
  </span>
);

export default Text;
