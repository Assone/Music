import { cx } from '@emotion/css';
import classnames from 'classnames';
import { PropsWithChildren } from 'react';

export interface TitleProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Title: React.FC<PropsWithChildren<TitleProps>> = ({
  level = 1,
  children,
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={cx(
        classnames({
          'text-3xl': level === 1,
          'text-2xl': level === 2,
          'text-xl': level === 3,
          'text-lg': level === 4,
          'text-base': level === 5,
          'text-sm': level === 6,
        }),
        'text-black dark:text-white font-bold',
      )}
    >
      {children}
    </Tag>
  );
};

export default Title;
