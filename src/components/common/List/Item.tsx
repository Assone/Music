import useKeyboardEvent from '@/hooks/common/useKeyboardEvent';
import type { PropsWithChildren } from 'react';

export interface ListItemProps {
  onClick?: () => void;
}

const ListItem: React.FC<PropsWithChildren<ListItemProps>> = ({
  onClick,
  children,
}) => {
  const onKeyDown = useKeyboardEvent({
    Enter: {
      callback: onClick,
    },
  });

  return (
    <div onClick={onClick} onKeyDown={onKeyDown} role='button' tabIndex={0}>
      {children}
    </div>
  );
};

export default ListItem;
