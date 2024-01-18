import useAsyncEffect from '@/hooks/common/useAsyncEffect';
import type { ConfigurableStyle } from '@/types/props';
import classNames from 'classnames';
import { m, useAnimation } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export interface OverlayProps
  extends Pick<ConfigurableStyle, 'className' | 'style'> {
  visible?: boolean;
  duration?: number;
  zIndex?: number;

  onClick?: () => void;
}

const Overlay: React.FC<PropsWithChildren<OverlayProps>> = ({
  visible,
  duration,
  zIndex,

  className,
  style,

  children,

  onClick,
}) => {
  const [active, setActive] = useState(visible);
  const animate = useAnimation();

  useAsyncEffect(async () => {
    if (visible) {
      setActive(true);
    }

    await animate.start({ opacity: visible ? 1 : 0 });
  }, [animate, visible]);

  return (
    <m.div
      className={classNames(
        'fixed left-0 top-0 h-full w-full bg-black/75',
        className,
      )}
      style={{
        display: active ? undefined : 'none',
        zIndex,
        ...style,
      }}
      animate={animate}
      transition={{
        type: 'spring',
        stiffness: 50,
        duration,
      }}
      onAnimationComplete={() => {
        setActive(visible);
      }}
      onClick={(evt) => {
        if (evt.target === evt.currentTarget) {
          onClick?.();
        }
      }}
      aria-hidden
    >
      {children}
    </m.div>
  );
};

export default Overlay;
