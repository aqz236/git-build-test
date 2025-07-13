import { useState } from "react";
import type { GitHubTag } from "../../shared/types";
import {
  useBatchDelete,
  useCommit,
  useDeleteTag,
  useTags,
} from "../hooks/github.hooks";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingCard } from "./Loading";

export function TagsManager() {
  const { data: tags, isLoading, error, refetch } = useTags();
  const deleteTag = useDeleteTag();
  const batchDelete = useBatchDelete();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelectAll = () => {
    if (selectedTags.size === tags?.length) {
      setSelectedTags(new Set());
    } else {
      setSelectedTags(new Set(tags?.map((t) => t.name) || []));
    }
  };

  const handleSelectTag = (tagName: string) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tagName)) {
      newSelected.delete(tagName);
    } else {
      newSelected.add(tagName);
    }
    setSelectedTags(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedTags.size === 0) return;

    try {
      await batchDelete.mutateAsync({
        type: "tags",
        items: Array.from(selectedTags),
      });
      setSelectedTags(new Set());
      setShowConfirm(false);
    } catch (error) {
      console.error("Failed to delete tags:", error);
    }
  };

  const handleDeleteSingle = async (tagName: string) => {
    try {
      await deleteTag.mutateAsync(tagName);
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Tags</h2>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tags</h2>
        <ErrorMessage message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          <i className="fas fa-tags mr-2 text-green-600"></i>
          Tags ({tags?.length || 0})
        </h2>
        <div className="flex gap-2">
          {selectedTags.size > 0 && (
            <>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={batchDelete.isPending}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <i className="fas fa-trash mr-2"></i>
                Delete Selected ({selectedTags.size})
              </button>
              <button
                onClick={() => setSelectedTags(new Set())}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Selection
              </button>
            </>
          )}
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTags.size === tags.length && tags.length > 0}
                onChange={handleSelectAll}
                className="mr-2"
              />
              Select All
            </label>
          </div>
          <div className="divide-y">
            {tags.map((tag) => (
              <TagCard
                key={tag.name}
                tag={tag}
                isSelected={selectedTags.has(tag.name)}
                onSelect={() => handleSelectTag(tag.name)}
                onDelete={() => handleDeleteSingle(tag.name)}
                isDeleting={deleteTag.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {tags && tags.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fas fa-tags text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-500">No tags found</h3>
          <p className="text-gray-400">
            This repository doesn't have any tags yet.
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedTags.size} tag(s)? This
              action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={batchDelete.isPending}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {batchDelete.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash mr-2"></i>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TagCardProps {
  tag: GitHubTag;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

function TagCard({
  tag,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
}: TagCardProps) {
  const { data: commit, isLoading: commitLoading } = useCommit(tag.commit.sha);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg text-green-700">
              <i className="fas fa-tag mr-2"></i>
              {tag.name}
            </h3>
            <a
              href={tag.commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-mono"
            >
              {tag.commit.sha.substring(0, 7)}
            </a>
          </div>

          {commitLoading ? (
            <div className="text-sm text-gray-500">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Loading commit info...
            </div>
          ) : commit ? (
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                {commit.author && (
                  <div className="flex items-center gap-1">
                    <img
                      src={commit.author.avatar_url}
                      alt={commit.author.login}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{commit.author.login}</span>
                  </div>
                )}
                <div>
                  <i className="fas fa-calendar mr-1"></i>
                  {formatDate(commit.commit.author.date)}
                </div>
              </div>

              <div className="text-sm text-gray-700">
                <div className="font-medium">Commit message:</div>
                <div className="mt-1 max-w-2xl">
                  {commit.commit.message.split("\n")[0]}
                  {commit.commit.message.includes("\n") && (
                    <span className="text-gray-500">...</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Unable to load commit information
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <a
              href={tag.zipball_url}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
            >
              <i className="fas fa-download mr-1"></i>
              ZIP
            </a>
            <a
              href={tag.tarball_url}
              className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
            >
              <i className="fas fa-download mr-1"></i>
              TAR
            </a>
          </div>
        </div>

        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
          title="Delete tag"
        >
          {isDeleting ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <i className="fas fa-trash"></i>
          )}
        </button>
      </div>
    </div>
  );
}
