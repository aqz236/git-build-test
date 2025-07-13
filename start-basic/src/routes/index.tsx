import { createFileRoute, Link } from '@tanstack/react-router'
import { Github, Home as HomeIcon, Settings, Zap } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Home,
})

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
              to="/github"
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
              统一管理 GitHub 仓库的 releases 和 tags，支持批量操作、搜索过滤和构建产物下载
            </p>
            <Link
              to="/github"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              立即体验 →
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-6">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              CI/CD 工具
            </h3>
            <p className="text-gray-600 mb-6">
              即将推出：集成主流 CI/CD 平台，统一管理构建流水线和部署任务
            </p>
            <span className="inline-flex items-center text-gray-400 font-medium">
              敬请期待 →
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-6">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              项目配置管理
            </h3>
            <p className="text-gray-600 mb-6">
              即将推出：统一管理项目配置文件，支持模板化配置和批量更新
            </p>
            <span className="inline-flex items-center text-gray-400 font-medium">
              敬请期待 →
            </span>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            快速开始
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                配置 GitHub 管理器
              </h3>
              <ol className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  获取 GitHub Personal Access Token
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  配置环境变量 (.env 文件)
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  开始管理你的仓库
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                主要功能
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  分页查询 releases 和 tags
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  关键词搜索和过滤
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  批量删除操作
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  构建产物下载
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Markdown 内容预览
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
