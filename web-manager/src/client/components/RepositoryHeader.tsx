import { useRepository } from "../hooks/github.hooks";

export function RepositoryHeader() {
  const { data: repo, isLoading, error } = useRepository();

  if (isLoading) {
    return (
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-red-800">
            <i className="fas fa-exclamation-triangle mr-2"></i>
            Failed to load repository information
          </div>
        </div>
      </div>
    );
  }

  if (!repo) return null;

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <i className="fab fa-github text-gray-600 mr-3 text-xl"></i>
              <h1 className="text-2xl font-bold text-gray-900">
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  {repo.full_name}
                </a>
              </h1>
            </div>
            {repo.description && (
              <p className="text-gray-600">{repo.description}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Default Branch</div>
            <div className="font-semibold text-gray-900">
              {repo.default_branch}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
