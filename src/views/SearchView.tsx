import useSearchResource from "@/hooks/useSearchResource";
import { SearchRoute } from "@/services/routes";
import { useSearch } from "@tanstack/react-router";
import { m } from "framer-motion";

const SearchView: React.FC = () => {
  const { keyword } = useSearch({ from: SearchRoute.id });
  const { hotListQuery } = useSearchResource({
    keyword,
  });

  return (
    <div>
      <h1>Search View</h1>
      <div className="flex gap-2 flex-wrap">
        {hotListQuery.data.map((item) => (
          <m.span className="p-2 border" key={item.keyword}>
            {item.keyword}
          </m.span>
        ))}
      </div>
    </div>
  );
};

export default SearchView;
