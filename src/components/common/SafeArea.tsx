import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

type SafeAreaPosition = 'top' | 'bottom' | 'left' | 'right';

interface SafeAreaProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  position: SafeAreaPosition[];
  multiple?: number;
}

const SafeArea: React.FC<PropsWithChildren<SafeAreaProps>> = ({
  position,
  multiple = 1,
  children,

  style,
  className,

  ...props
}) => (
  <div
    style={
      { '--safe-area-multiple': multiple, ...style } as React.CSSProperties
    }
    className={classNames(
      'w-full',
      {
        'safe-area-top': position.includes('top'),
        'safe-area-bottom': position.includes('bottom'),
        'safe-area-left': position.includes('left'),
        'safe-area-right': position.includes('right'),
      },
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export default SafeArea;
