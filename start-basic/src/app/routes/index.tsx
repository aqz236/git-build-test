import { createFileRoute, Link } from "@tanstack/react-router";
import { Github, Home as HomeIcon, Settings, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-600 rounded-full">
              <HomeIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            开发者工具平台
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            集成多种开发者工具的统一管理平台，提升开发效率，简化工作流程
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/github-manager"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Github className="w-5 h-5" />
              开始使用
            </Link>
            <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <Settings className="w-5 h-5" />
              了解更多
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-6">
              <Github className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              GitHub 仓库管理
            </h3>
            <p className="text-gray-600 mb-6">
              统一管理 GitHub 仓库的 releases 和 tags，支持批量操作和搜索功能
            </p>
            <Link
              to="/github-manager"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              立即体验
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-6">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              CI/CD 工具
            </h3>
            <p className="text-gray-600 mb-6">
              集成持续集成和部署工具，自动化构建和发布流程
            </p>
            <button
              disabled
              className="inline-flex items-center gap-2 text-gray-400 font-medium cursor-not-allowed"
            >
              即将推出
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-6">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              配置管理
            </h3>
            <p className="text-gray-600 mb-6">
              统一管理各种开发工具的配置，支持模板和版本控制
            </p>
            <button
              disabled
              className="inline-flex items-center gap-2 text-gray-400 font-medium cursor-not-allowed"
            >
              即将推出
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            为什么选择我们的平台？
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">高效便捷</h3>
              <p className="text-sm text-gray-600">
                一站式管理，无需切换多个工具
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">安全可靠</h3>
              <p className="text-sm text-gray-600">
                使用官方 API，保障数据安全
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">🎨</div>
              <h3 className="font-semibold text-gray-900 mb-2">界面友好</h3>
              <p className="text-sm text-gray-600">现代化设计，操作简单直观</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">🚀</div>
              <h3 className="font-semibold text-gray-900 mb-2">持续更新</h3>
              <p className="text-sm text-gray-600">定期添加新功能和优化</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
