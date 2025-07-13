import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGitHubStore } from "~/utils/github_releases_tags/github-store";

interface PaginationProps {
  type: "releases" | "tags";
}

export function Pagination({ type }: PaginationProps) {
  const store = useGitHubStore();

  const currentPage = type === "releases" ? store.releasesPage : store.tagsPage;
  const hasNextPage =
    type === "releases" ? store.releasesHasNextPage : store.tagsHasNextPage;
  const dataLength =
    type === "releases" ? store.releases.length : store.tags.length;
  const isSearching = store.isSearching;

  const fetchData = type === "releases" ? store.fetchReleases : store.fetchTags;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchData(currentPage - 1, store.debouncedSearchKeyword);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      fetchData(currentPage + 1, store.debouncedSearchKeyword);
    }
  };

  // 搜索模式下不显示分页
  if (isSearching) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        第 {currentPage} 页，共显示 {dataLength} 条记录
      </div>
      <div className="flex gap-2">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          上一页
        </button>
        <button
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
        >
          下一页
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
