import { getGlobalIndex } from '@/hooks/common/useGlobalZIndex';
import classNames from 'classnames';
import {
  animate,
  m,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import type { PropsWithChildren } from 'react';
import Overlay from './Overlay';
import Portal from './Portal';
import SafeArea from './SafeArea';

type PopupPosition = 'top' | 'bottom' | 'left' | 'right';

export interface PopupProps {
  visible?: boolean;
  protal?: string;
  overlay?: boolean;
  position?: PopupPosition;
  zIndex?: number;
  duration?: number;

  closeOnOverlayClick?: boolean;

  onClose?: () => void;
  onClickOverlay?: () => void;
}

const Popup: React.FC<PropsWithChildren<PopupProps>> = ({
  visible,
  protal,
  overlay = true,
  position = 'bottom',
  closeOnOverlayClick = true,
  duration = 0.4,

  zIndex = getGlobalIndex(),

  children,

  ...props
}) => {
  const [active, setActive] = useState(visible);
  const ref = useRef<HTMLDivElement>(null);

  const percent = useMotionValue(visible ? 0 : 100);
  const spring = useTransform(percent, Math.round);
  const x = useTransform(spring, (value) => {
    switch (position) {
      case 'left': {
        return -value;
      }
      case 'right': {
        return value;
      }

      default: {
        return 0;
      }
    }
  });
  const y = useTransform(spring, (value) => {
    switch (position) {
      case 'top': {
        return -value;
      }
      case 'bottom': {
        return value;
      }

      default: {
        return 0;
      }
    }
  });
  const transform = useMotionTemplate`translate(${x}%, ${y}%)`;

  useEffect(() => {
    if (visible) {
      setActive(true);
    }

    const animation = animate(percent, visible ? 0 : 100, { duration });

    return animation.stop;
  }, [duration, percent, visible]);

  const onClose = () => {
    props.onClose?.();
  };

  const onClickOverlay = () => {
    props.onClickOverlay?.();

    if (closeOnOverlayClick) {
      onClose();
    }
  };

  const renderOverlay = () => {
    if (overlay) {
      return (
        <Overlay visible={visible} zIndex={zIndex} onClick={onClickOverlay} />
      );
    }

    return null;
  };

  const renderContainer = () => (
    <m.div
      ref={ref}
      style={{
        display: active ? undefined : 'none',
        zIndex: zIndex + 10,
        transform,
      }}
      className={classNames('fixed bg-white shadow-2xl', {
        'h-full': position === 'left' || position === 'right',
        'w-full': position === 'top' || position === 'bottom',
        'left-0 top-0': position === 'top',
        'bottom-0 left-0': position === 'bottom',
        'right-0 top-0': position === 'right',
        'bottom-0 right-0': position === 'left',
      })}
      onAnimationComplete={() => {
        setActive(visible);
      }}
    >
      <SafeArea tabIndex={0} role='dialog' position={['top', 'bottom']}>
        {children}
      </SafeArea>
    </m.div>
  );

  if (protal) {
    return (
      <Portal target={protal}>
        {renderOverlay()}
        {renderContainer()}
      </Portal>
    );
  }

  return (
    <>
      {renderOverlay()}
      {renderContainer()}
    </>
  );
};

export default Popup;
