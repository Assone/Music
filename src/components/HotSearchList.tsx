import { searchKeys } from '@/services/query/keys';
import {
  SearchHotListContainerVariants,
  SearchHotListItemVariants,
} from '@/utils/variants';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import { AnimatePresence, m } from 'framer-motion';

interface HotSearchListProps {
  className?: string;
  onSelected?: (keyword: string) => void;
}

const HotSearchList: React.FC<HotSearchListProps> = ({
  className,
  onSelected,
}) => {
  const { data: hotList = [], isPending } = useQuery({
    ...searchKeys.hot(),
    initialData: [],
  });

  return (
    <AnimatePresence>
      <IF condition={isPending === false} fallback={<div>Loading...</div>}>
        <m.div
          className={classNames('flex flex-wrap gap-2', className)}
          variants={SearchHotListContainerVariants}
          initial={import.meta.env.SSR ? false : 'hidden'}
          animate="show"
        >
          {hotList.map(({ keyword }) => (
            <m.div
              key={keyword}
              className="p-2 rounded dark:bg-gray-800 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              variants={SearchHotListItemVariants}
              onClick={() => {
                onSelected?.(keyword);
              }}
            >
              <Typography.Text>{keyword}</Typography.Text>
            </m.div>
          ))}
        </m.div>
      </IF>
    </AnimatePresence>
  );
};

export default HotSearchList;
