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

export const SearchHotListContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

export const SearchHotListItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const PlayerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};
