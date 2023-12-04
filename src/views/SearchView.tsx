import { Suspense } from 'react';

const SearchSongsTrackList = lazy(
  () => import('@/components/SearchSongsTrackList'),
);

const SearchView: React.FC = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';

  const onKeywordChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const keyword = event.target.value;
      searchParams.set('keyword', keyword);
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );

  const isEmpty = keyword === undefined || keyword === '';

  return (
    <div className="p-4 flex flex-col gap-2">
      <Typography.Title>Search</Typography.Title>
      <input
        type="text"
        className="w-full p-2 rounded dark:bg-gray-800"
        placeholder="想听什么？"
        value={keyword}
        onChange={onKeywordChange}
      />

      {!isEmpty && (
        <div className="flex flex-col gap-2">
          <Typography.Title level={2}>单曲</Typography.Title>
          <Suspense>
            <SearchSongsTrackList keyword={keyword} />
          </Suspense>
        </div>
      )}

      {isEmpty && (
        <div className="flex flex-col gap-2">
          <Typography.Title level={2}>热门搜索</Typography.Title>
          <HotSearchList
            onSelected={(keyword) => {
              searchParams.set('keyword', keyword);
              setSearchParams(searchParams);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchView;
