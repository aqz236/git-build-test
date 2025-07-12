import { formatDate } from './utils.js';

/**
 * Header组件 - 显示版本信息和基本信息
 * @param {Object} props
 * @param {import('./types.js').ReleaseData} props.releaseData
 * @returns {React.ReactElement}
 */
function Header({ releaseData }) {

  return (
    <header className="gradient-bg text-white py-12">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-4">
              <a href="../" className="text-white hover:text-gray-200 mr-4">
                <i className="fas fa-arrow-left text-xl"></i>
              </a>
              <h1 className="text-4xl font-bold">版本 {releaseData.version}</h1>
            </div>
            <div className="flex flex-wrap gap-4 text-sm opacity-90">
              <span className="flex items-center">
                <i className="fas fa-calendar-alt mr-2"></i>
                {formatDate(releaseData.createdAt)}
              </span>
              <span className="flex items-center">
                <i className="fas fa-code-commit mr-2"></i>
                <code className="bg-white bg-opacity-20 px-2 py-1 rounded">
                  {releaseData.commitHash.substring(0, 7)}
                </code>
              </span>
              <span className="flex items-center">
                <i className="fas fa-code-branch mr-2"></i>
                {releaseData.privateBranch}
              </span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-2xl mb-2">🎉</div>
              <div className="text-sm opacity-90">发布成功</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ES6 默认导出
export default Header;
