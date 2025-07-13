import { useState } from "react";
import type { GitHubRelease } from "../../shared/types";
import {
  useBatchDelete,
  useDeleteRelease,
  useReleases,
} from "../hooks/github.hooks";
import { ErrorMessage } from "./ErrorMessage";
import { LoadingCard } from "./Loading";

export function ReleasesManager() {
  const { data: releases, isLoading, error, refetch } = useReleases();
  const deleteRelease = useDeleteRelease();
  const batchDelete = useBatchDelete();
  const [selectedReleases, setSelectedReleases] = useState<Set<number>>(
    new Set()
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSelectAll = () => {
    if (selectedReleases.size === releases?.length) {
      setSelectedReleases(new Set());
    } else {
      setSelectedReleases(new Set(releases?.map((r) => r.id) || []));
    }
  };

  const handleSelectRelease = (releaseId: number) => {
    const newSelected = new Set(selectedReleases);
    if (newSelected.has(releaseId)) {
      newSelected.delete(releaseId);
    } else {
      newSelected.add(releaseId);
    }
    setSelectedReleases(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedReleases.size === 0) return;

    try {
      await batchDelete.mutateAsync({
        type: "releases",
        items: Array.from(selectedReleases).map(String),
      });
      setSelectedReleases(new Set());
      setShowConfirm(false);
    } catch (error) {
      console.error("Failed to delete releases:", error);
    }
  };

  const handleDeleteSingle = async (releaseId: number) => {
    try {
      await deleteRelease.mutateAsync(releaseId);
    } catch (error) {
      console.error("Failed to delete release:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Releases</h2>
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
        <h2 className="text-xl font-semibold">Releases</h2>
        <ErrorMessage message={error.message} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          <i className="fas fa-tag mr-2 text-blue-600"></i>
          Releases ({releases?.length || 0})
        </h2>
        <div className="flex gap-2">
          {selectedReleases.size > 0 && (
            <>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={batchDelete.isPending}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <i className="fas fa-trash mr-2"></i>
                Delete Selected ({selectedReleases.size})
              </button>
              <button
                onClick={() => setSelectedReleases(new Set())}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Selection
              </button>
            </>
          )}
        </div>
      </div>

      {releases && releases.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={
                  selectedReleases.size === releases.length &&
                  releases.length > 0
                }
                onChange={handleSelectAll}
                className="mr-2"
              />
              Select All
            </label>
          </div>
          <div className="divide-y">
            {releases.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                isSelected={selectedReleases.has(release.id)}
                onSelect={() => handleSelectRelease(release.id)}
                onDelete={() => handleDeleteSingle(release.id)}
                isDeleting={deleteRelease.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {releases && releases.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <i className="fas fa-tag text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-500">
            No releases found
          </h3>
          <p className="text-gray-400">
            This repository doesn't have any releases yet.
          </p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {selectedReleases.size}{" "}
              release(s)? This action cannot be undone.
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

interface ReleaseCardProps {
  release: GitHubRelease;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

function ReleaseCard({
  release,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
}: ReleaseCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSize = (bytes: number) => {
    const sizes = ["B", "KB", "MB", "GB"];
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
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
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">
              <a
                href={release.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {release.name}
              </a>
            </h3>
            <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {release.tag_name}
            </span>
            {release.prerelease && (
              <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                Pre-release
              </span>
            )}
            {release.draft && (
              <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                Draft
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <img
                src={release.author.avatar_url}
                alt={release.author.login}
                className="w-5 h-5 rounded-full"
              />
              <span>{release.author.login}</span>
            </div>
            <div>
              <i className="fas fa-calendar mr-1"></i>
              {formatDate(release.published_at || release.created_at)}
            </div>
          </div>

          {release.body && (
            <div className="text-gray-700 text-sm mb-3 max-w-2xl">
              {release.body
                .split("\n")
                .slice(0, 3)
                .map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              {release.body.split("\n").length > 3 && (
                <div className="text-gray-500">...</div>
              )}
            </div>
          )}

          {release.assets.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Assets ({release.assets.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {release.assets.map((asset) => (
                  <div
                    key={asset.id}
                    className="bg-gray-50 rounded p-2 text-sm"
                  >
                    <div className="font-medium truncate">{asset.name}</div>
                    <div className="text-gray-600 flex justify-between">
                      <span>{formatSize(asset.size)}</span>
                      <span>
                        <i className="fas fa-download mr-1"></i>
                        {asset.download_count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
          title="Delete release"
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
