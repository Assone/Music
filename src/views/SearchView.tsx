import HotKeywords from '@/components/HotKeywords';
import SearchAlbums from '@/components/SearchAlbums';
import SearchArtists from '@/components/SearchArtists';
import SearchMvs from '@/components/SearchMvs';
import SearchSongs from '@/components/SearchSongs';
import IF from '@/components/common/IF';
import { SearchRoute } from '@/services/routes';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useMemo } from 'react';

const SearchView: React.FC = () => {
  const { keyword = '' } = useSearch({ from: SearchRoute.id });
  const isEmpty = useMemo(() => keyword === '', [keyword]);
  const navigate = useNavigate();

  const onChangeKeyword = (newKeyword: string) => {
    navigate({
      search: (prev) => ({ ...prev, keyword: newKeyword }),
    }).catch((error) => {
      console.error('[Router navigate error]', error);
    });
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className='p-1'>
        <input
          className='rounded border'
          type='search'
          value={keyword}
          onChange={(evt) => onChangeKeyword(evt.target.value)}
        />
      </div>

      <IF condition={isEmpty}>
        <HotKeywords onClick={onChangeKeyword} />
      </IF>
      <IF condition={isEmpty === false}>
        <SearchArtists keyword={keyword} />
        <SearchSongs keyword={keyword} />
        <SearchAlbums keyword={keyword} />
        <SearchMvs keyword={keyword} />
      </IF>
    </div>
  );
};

export default SearchView;
