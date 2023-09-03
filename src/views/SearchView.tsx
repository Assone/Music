const SearchView: React.FC = () => (
  <div className="p-4 flex flex-col gap-2">
    <Typography.Title>Search</Typography.Title>
    <input
      type="text"
      className="w-full p-2 rounded dark:bg-gray-800"
      placeholder="想听什么？"
    />
  </div>
);

export default SearchView;
