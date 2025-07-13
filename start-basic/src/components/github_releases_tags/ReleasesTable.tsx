import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Calendar, ExternalLink, Tag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { GitHubRelease } from "~/utils/github_releases_tags/github";
import { deleteRelease } from "~/utils/github_releases_tags/github";
import { useGitHubStore } from "~/utils/github_releases_tags/github-store";
import { AssetsButton } from "./AssetsButton";
import { ConfirmDialog } from "./ConfirmDialog";
import { MarkdownViewer } from "./MarkdownViewer";

const columnHelper = createColumnHelper<GitHubRelease>();

export function ReleasesTable() {
  const {
    releases,
    releasesLoading,
    releasesError,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    fetchReleases,
    debouncedSearchKeyword,
    clearCache,
  } = useGitHubStore();

  const [deletingRelease, setDeletingRelease] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    releaseId: number;
    releaseName: string;
  } | null>(null);

  useEffect(() => {
    fetchReleases(1, debouncedSearchKeyword);
  }, [fetchReleases, debouncedSearchKeyword]);

  const handleDeleteSingleRelease = async (
    releaseId: number,
    releaseName: string
  ) => {
    setConfirmDelete({ releaseId, releaseName });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    const { releaseId } = confirmDelete;
    setConfirmDelete(null);
    setDeletingRelease(releaseId);

    try {
      await deleteRelease(releaseId);
      // 清除缓存并重新获取数据
      clearCache();
      await fetchReleases();
    } catch (error) {
      console.error("删除发布版本失败:", error);
    } finally {
      setDeletingRelease(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={
            releases.length > 0 && releases.every((r) => selectedIds.has(r.id))
          }
          onChange={() => toggleSelectAll(releases)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={selectedIds.has(row.original.id)}
          onChange={() => toggleSelection(row.original.id)}
        />
      ),
    }),
    columnHelper.accessor("tag_name", {
      header: "Tag",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-blue-500" />
          <a
            href={`https://github.com/${import.meta.env.VITE_GITHUB_OWNER}/${import.meta.env.VITE_GITHUB_REPO}/releases/tag/${row.getValue("tag_name")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {row.getValue("tag_name")}
          </a>
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: "Release Name",
      cell: ({ row }) => (
        <a
          href={row.original.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="max-w-xs truncate block text-blue-600 hover:text-blue-800 hover:underline"
          title={row.getValue("name")}
        >
          {row.getValue("name")}
        </a>
      ),
    }),
    columnHelper.accessor("author", {
      header: "Author",
      cell: ({ row }) => {
        const author = row.getValue("author") as GitHubRelease["author"];
        return (
          <div className="flex items-center gap-2">
            <img
              src={author.avatar_url}
              alt={author.login}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm">{author.login}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("published_at", {
      header: "Published",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          {new Date(row.getValue("published_at")).toLocaleDateString()}
        </div>
      ),
    }),
    columnHelper.display({
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.draft && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              Draft
            </span>
          )}
          {row.original.prerelease && (
            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
              Pre-release
            </span>
          )}
          {!row.original.draft && !row.original.prerelease && (
            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
              Released
            </span>
          )}
        </div>
      ),
    }),
    columnHelper.display({
      id: "assets",
      header: "Assets",
      cell: ({ row }) => (
        <AssetsButton
          assets={row.original.assets}
          title={row.original.name || row.original.tag_name}
        />
      ),
    }),
    columnHelper.display({
      id: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-xs">
          {row.original.body ? (
            <MarkdownViewer
              content={row.original.body}
              title={`${row.original.name || row.original.tag_name} - Release Notes`}
            />
          ) : (
            <span className="text-xs text-gray-500">无描述</span>
          )}
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <a
            href={row.original.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <ExternalLink className="w-4 h-4" />
            View
          </a>
          <button
            onClick={() =>
              handleDeleteSingleRelease(
                row.original.id,
                row.original.name || row.original.tag_name
              )
            }
            disabled={deletingRelease === row.original.id}
            className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 disabled:opacity-50"
            title="删除此发布版本"
          >
            <Trash2 className="w-4 h-4" />
            {deletingRelease === row.original.id ? "删除中..." : "删除"}
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: releases,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (releasesError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">加载失败</h3>
        <p className="text-red-600 text-sm mt-1">
          请检查您的GitHub配置和网络连接。错误信息：{releasesError}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {releasesLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 确认删除对话框 */}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="删除发布版本"
        message={`确定要删除发布版本 "${confirmDelete?.releaseName}" 吗？此操作不可撤销，删除后将无法恢复。`}
        confirmText="删除"
        cancelText="取消"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
