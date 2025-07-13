import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Check, Copy, ExternalLink, GitBranch } from "lucide-react";
import { useEffect, useState } from "react";
import type { GitHubTag } from "~/utils/github_releases_tags/github";
import { useGitHubStore } from "~/utils/github_releases_tags/github-store";
import { MarkdownViewer } from "./MarkdownViewer";
import { TagDownloadButton } from "./TagDownloadButton";

const columnHelper = createColumnHelper<GitHubTag>();

export function TagsTable() {
  const {
    tags,
    tagsLoading,
    tagsError,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    fetchTags,
    debouncedSearchKeyword,
  } = useGitHubStore();

  const [copiedSha, setCopiedSha] = useState<string | null>(null);

  useEffect(() => {
    fetchTags(1, debouncedSearchKeyword);
  }, [fetchTags, debouncedSearchKeyword]);

  const copyToClipboard = async (text: string, sha: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSha(sha);
      setTimeout(() => setCopiedSha(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={
            tags.length > 0 && tags.every((t) => selectedIds.has(t.name))
          }
          onChange={() => toggleSelectAll(tags)}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="rounded border-gray-300"
          checked={selectedIds.has(row.original.name)}
          onChange={() => toggleSelection(row.original.name)}
        />
      ),
    }),
    columnHelper.accessor("name", {
      header: "Tag Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-green-500" />
          <a
            href={`https://github.com/${import.meta.env.VITE_GITHUB_OWNER}/${import.meta.env.VITE_GITHUB_REPO}/releases/tag/${row.getValue("name")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium font-mono text-blue-600 hover:text-blue-800 hover:underline"
          >
            {row.getValue("name")}
          </a>
        </div>
      ),
    }),
    columnHelper.accessor("commit", {
      header: "Commit SHA",
      cell: ({ row }) => {
        const commit = row.getValue("commit") as GitHubTag["commit"];
        const shortSha = commit.sha.substring(0, 8);
        return (
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
              {shortSha}
            </code>
            <button
              onClick={() => copyToClipboard(commit.sha, commit.sha)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="复制完整SHA"
            >
              {copiedSha === commit.sha ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "downloads",
      header: "Downloads",
      cell: ({ row }) => (
        <TagDownloadButton
          tagName={row.original.name}
          zipballUrl={row.original.zipball_url}
          tarballUrl={row.original.tarball_url}
        />
      ),
    }),
    columnHelper.display({
      id: "commit_message",
      header: "Commit Message",
      cell: ({ row }) => (
        <div className="max-w-xs">
          {row.original.commit.message ? (
            <MarkdownViewer
              content={row.original.commit.message}
              title={`${row.original.name} - Commit Message`}
            />
          ) : (
            <span className="text-xs text-gray-500">无提交信息</span>
          )}
        </div>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <a
          href={row.original.commit.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="w-4 h-4" />
          View Commit
        </a>
      ),
    }),
  ];

  const table = useReactTable({
    data: tags,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (tagsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-medium">加载失败</h3>
        <p className="text-red-600 text-sm mt-1">
          请检查您的GitHub配置和网络连接。错误信息：{tagsError}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {tagsLoading ? (
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
    </div>
  );
}
