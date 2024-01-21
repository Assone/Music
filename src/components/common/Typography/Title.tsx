import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, PropsWithChildren } from 'react';

const variants = cva('font-bold text-black dark:text-white', {
  variants: {
    level: {
      1: 'text-4xl',
      2: 'text-3xl',
      3: 'text-2xl',
      4: 'text-xl',
      5: 'text-lg',
      6: 'text-base',
    },
  },
});

export interface TitleProps
  extends Pick<HTMLAttributes<HTMLElement>, 'className'>,
    VariantProps<typeof variants> {}

const Title: React.FC<PropsWithChildren<TitleProps>> = ({
  level = 1,

  children,

  className,

  ...props
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={variants({ level, className })}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Title;
