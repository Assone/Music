import type { Variants } from 'framer-motion';

export const PageTransitionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

export const SearchHotKeywordsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

export const SearchHotKeywordsItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
