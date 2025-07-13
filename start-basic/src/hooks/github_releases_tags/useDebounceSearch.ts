import { useEffect } from "react";
import { useGitHubStore } from "~/utils/github_releases_tags/github-store";

export function useDebounceSearch() {
  const { searchKeyword, setDebouncedSearchKeyword, setIsSearching } =
    useGitHubStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchKeyword(searchKeyword);
      setIsSearching(!!searchKeyword.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword, setDebouncedSearchKeyword, setIsSearching]);
}
