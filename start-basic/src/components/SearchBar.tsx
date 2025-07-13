import { Search } from "lucide-react";
import { useDebounceSearch } from "~/hooks/useDebounceSearch";
import { useGitHubStore } from "~/utils/github-store";

export function SearchBar() {
  const { searchKeyword, setSearchKeyword, isSearching, activeTab } =
    useGitHubStore();

  useDebounceSearch();

  return (
    <div className="flex gap-2 items-center">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder={`搜索${activeTab === "releases" ? "releases" : "tags"}...`}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>
      {isSearching && (
        <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
          搜索中...
        </span>
      )}
    </div>
  );
}
