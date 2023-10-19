import classnames from 'classnames';

import { HTMLAttributes, PropsWithChildren } from 'react';

export interface TitleProps
  extends Pick<HTMLAttributes<HTMLElement>, 'className'> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Title: React.FC<PropsWithChildren<TitleProps>> = ({
  level = 1,
  children,
  className,
  ...props
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={classnames(
        classnames({
          'text-3xl': level === 1,
          'text-2xl': level === 2,
          'text-xl': level === 3,
          'text-lg': level === 4,
          'text-base': level === 5,
          'text-sm': level === 6,
        }),
        'text-black dark:text-white font-bold',
        className,
      )}
    >
      {children}
    </Tag>
  );
};

export default Title;
