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
  <MotionConfig transition={{ duration: 0.4, ease: [0.43, 0.13, 0.23, 0.96] }}>
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
