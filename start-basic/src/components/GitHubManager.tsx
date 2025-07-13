import { useGitHubStore } from "~/utils/github-store";
import { BulkActions } from "./BulkActions";
import { Pagination } from "./Pagination";
import { ReleasesTable } from "./ReleasesTable";
import { SearchBar } from "./SearchBar";
import { TabSwitcher } from "./TabSwitcher";
import { TagsTable } from "./TagsTable";

export function GitHubManager() {
  const { activeTab } = useGitHubStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">GitHub 管理器</h1>
        <p className="text-gray-600">管理您的 GitHub Releases 和 Tags</p>
      </div>

      {/* Tabs */}
      <TabSwitcher />

      {/* Actions Bar */}
      <div className="flex items-center justify-between gap-4">
        <SearchBar />
        <BulkActions />
      </div>

      {/* Content */}
      {activeTab === "releases" ? <ReleasesTable /> : <TagsTable />}

      {/* Pagination */}
      <Pagination type={activeTab} />
    </div>
  );
}
