import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ReleasesManager } from "./components/ReleasesManager";
import { RepositoryHeader } from "./components/RepositoryHeader";
import { TagsManager } from "./components/TagsManager";
import { useBatchDelete } from "./hooks/github.hooks";

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  const [activeTab, setActiveTab] = useState<"releases" | "tags">("releases");
  const [showBatchConfirm, setShowBatchConfirm] = useState(false);
  const batchDelete = useBatchDelete();

  const handleBatchDeleteAll = async () => {
    try {
      await batchDelete.mutateAsync({
        type: "both",
        items: [],
      });
      setShowBatchConfirm(false);
    } catch (error) {
      console.error("Failed to delete all:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RepositoryHeader />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveTab("releases")}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "releases"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <i className="fas fa-tag mr-2"></i>
                Releases
              </button>
              <button
                onClick={() => setActiveTab("tags")}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeTab === "tags"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <i className="fas fa-tags mr-2"></i>
                Tags
              </button>
            </div>

            <button
              onClick={() => setShowBatchConfirm(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <i className="fas fa-trash-alt mr-2"></i>
              Delete All Releases & Tags
            </button>
          </div>
        </div>

        <div className="tab-content">
          {activeTab === "releases" && <ReleasesManager />}
          {activeTab === "tags" && <TagsManager />}
        </div>
      </div>

      {/* Batch Delete All Confirmation Modal */}
      {showBatchConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
              <h3 className="text-lg font-semibold mb-4 text-red-800">
                ⚠️ DANGER ZONE
              </h3>
              <p className="text-gray-600 mb-6">
                This will permanently delete <strong>ALL</strong> releases and
                tags in this repository. This action cannot be undone!
              </p>
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-6">
                <p className="text-sm text-red-700">
                  <i className="fas fa-warning mr-2"></i>
                  This will affect all releases and tags, including those that
                  may be referenced by deployments or workflows.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowBatchConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBatchDeleteAll}
                disabled={batchDelete.isPending}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {batchDelete.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Deleting All...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash-alt mr-2"></i>
                    Delete Everything
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

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
