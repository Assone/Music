import { getSearchHotList } from '@/apis/resources/search';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import { lastValueFrom } from 'rxjs';

// eslint-disable-next-line react-refresh/only-export-components
export const hotListQueryOptions = queryOptions({
  queryKey: ['search', 'hot'],
  queryFn: () => lastValueFrom(getSearchHotList()),
  initialData: [],
});

interface HotKeywordsProps {
  onClick?: (keyword: string) => void;
}

const HotKeywords: React.FC<HotKeywordsProps> = ({ onClick }) => {
  const { data } = useSuspenseQuery(hotListQueryOptions);

  return (
    <div className='flex flex-wrap gap-2'>
      {data.map((item) => (
        <m.span
          className='border p-2'
          key={item.keyword}
          onClick={() => onClick?.(item.keyword)}
        >
          {item.keyword}
        </m.span>
      ))}
    </div>
  );
};

export default HotKeywords;
