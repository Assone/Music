import useSearchResource from "@/hooks/useSearchResource";
import { SearchRoute } from "@/services/routes";
import { useSearch } from "@tanstack/react-router";

const SearchView: React.FC = () => {
  const { keyword } = useSearch({ from: SearchRoute.id });
  const { hotListQuery, artistsQuery, songsQuery } = useSearchResource({
    keyword,
  });

  return <div>Search View</div>;
};

export default SearchView;
