import { Variants } from 'framer-motion';

export const TrackListVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const TrackListItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, x: -20 },
  show: { opacity: 1, y: 0, x: 0 },
};
