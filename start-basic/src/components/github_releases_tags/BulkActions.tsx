import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useGitHubStore } from "~/utils/github_releases_tags/github-store";
import { ConfirmDialog } from "./ConfirmDialog";

export function BulkActions() {
  const { selectedIds, activeTab, deleteSelectedReleases, deleteSelectedTags } =
    useGitHubStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  if (selectedIds.size === 0) {
    return null;
  }

  const itemType = activeTab === "releases" ? "releases" : "tags";
  const itemTypeChinese = activeTab === "releases" ? "发布版本" : "标签";

  const handleDeleteClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDialog(false);
    setIsDeleting(true);

    try {
      if (activeTab === "releases") {
        await deleteSelectedReleases();
      } else {
        await deleteSelectedTags();
      }
      // 可以在这里添加成功提示
      console.log(`成功删除 ${selectedIds.size} 个 ${itemType}`);
    } catch (error) {
      console.error("删除失败:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  return (
    <>
      <button
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-4 h-4" />
        {isDeleting ? "删除中..." : `删除选中 (${selectedIds.size})`}
      </button>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title={`删除${itemTypeChinese}`}
        message={`确定要删除选中的 ${selectedIds.size} 个${itemTypeChinese}吗？此操作不可撤销，删除后将无法恢复。`}
        confirmText="删除"
        cancelText="取消"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
