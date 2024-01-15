import { PageTransitionVariants } from '@/utils/variants';
import { MotionConfig, m } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export interface PageTransitionProps {
  animate?: boolean;
}

const PageTransition: React.FC<PropsWithChildren<PageTransitionProps>> = ({
  animate = true,
  children,
}) => (
  <MotionConfig transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}>
    <m.div
      initial={animate ? 'hidden' : 'visible'}
      animate='visible'
      variants={PageTransitionVariants}
    >
      {children}
    </m.div>
  </MotionConfig>
);

export default PageTransition;
