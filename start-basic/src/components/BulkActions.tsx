import { Trash2 } from "lucide-react";
import { useGitHubStore } from "~/utils/github-store";

export function BulkActions() {
  const { selectedIds, activeTab, deleteSelectedReleases } = useGitHubStore();

  if (selectedIds.size === 0 || activeTab !== "releases") {
    return null;
  }

  const handleDelete = () => {
    const confirmed = window.confirm(
      `确定要删除选中的 ${selectedIds.size} 个 releases 吗？此操作不可撤销。`
    );
    if (confirmed) {
      deleteSelectedReleases();
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
      删除选中 ({selectedIds.size})
    </button>
  );
}
