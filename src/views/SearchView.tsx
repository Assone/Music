import { searchKeys } from '@/services/query/keys';
import { SearchRoute } from '@/services/router/map';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Variants, m } from 'framer-motion';

// million-ignore
const SearchView: React.FC = () => {
  const { keyword } = useSearch({ from: SearchRoute.id });
  const navigate = useNavigate();

  const { data: hotList } = useQuery({
    ...searchKeys.hot(),
    initialData: [],
  });

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <Typography.Title>Search</Typography.Title>
      <input
        type="text"
        className="w-full p-2 rounded dark:bg-gray-800"
        placeholder="想听什么？"
        value={keyword}
      />

      <div className="flex flex-col gap-2">
        <Typography.Title level={2}>热门搜索</Typography.Title>
        <m.div
          className="flex flex-wrap gap-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {hotList.map(({ keyword }) => (
            <m.div
              key={keyword}
              className="p-2 rounded dark:bg-gray-800 cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              variants={item}
              onClick={() => {
                navigate({
                  search: {
                    keyword,
                  },
                }).catch((error) => {
                  console.error('%c[Navigation Error]', 'color: #f00', error);
                });
              }}
            >
              <Typography.Text>{keyword}</Typography.Text>
            </m.div>
          ))}
        </m.div>
      </div>
    </div>
  );
};

export default SearchView;
