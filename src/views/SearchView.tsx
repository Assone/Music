import IF from '@/components/common/IF';
import useSearchResource from '@/hooks/useSearchResource';
import { SearchRoute } from '@/services/routes';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { m } from 'framer-motion';
import { useMemo } from 'react';

const SearchView: React.FC = () => {
  const { keyword = '' } = useSearch({ from: SearchRoute.id });
  const isEmpty = useMemo(() => keyword === '', [keyword]);
  const navigate = useNavigate();
  const { hotListQuery } = useSearchResource({
    keyword,
  });

  const onChangeKeyword = (newKeyword: string) => {
    navigate({
      search: (prev) => ({ ...prev, keyword: newKeyword }),
    }).catch((error) => {
      console.error('[Router navigate error]', error);
    });
  };

  return (
    <div className='flex flex-col gap-2'>
      <h1>Search View</h1>
      <input
        className='border p-1'
        value={keyword}
        onChange={(evt) => onChangeKeyword(evt.target.value)}
      />
      <IF condition={isEmpty}>
        <div className='flex flex-wrap gap-2'>
          {hotListQuery.data.map((item) => (
            <m.span
              className='border p-2'
              key={item.keyword}
              onClick={() => onChangeKeyword(item.keyword)}
            >
              {item.keyword}
            </m.span>
          ))}
        </div>
      </IF>
    </div>
  );
};

export default SearchView;
