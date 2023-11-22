import classnames from 'classnames';
import { m } from 'framer-motion';
import { PropsWithChildren } from 'react';

interface PlayButtonProps {
  onClick?: VoidFunction;
}

const PlayButton: React.FC<PropsWithChildren<PlayButtonProps>> = ({
  onClick,
  children,
}) => (
  <m.button
    className={classnames([
      'dark:text-white w-full rounded-xl bg-green-500 p-2 select-none transition-all',
    ])}
    onClick={onClick}
    whileTap={{ opacity: 0.8 }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </m.button>
);

export default PlayButton;
