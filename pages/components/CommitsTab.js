/**
 * CommitsTab组件 - 提交记录标签页内容
 * @param {Object} props
 * @param {string[]} props.branches - 分支列表
 * @param {Record<string, string[]>} props.branchData - 分支数据
 * @param {string|null} props.activeBranch - 当前激活的分支
 * @param {function(string): void} props.onBranchChange - 分支切换回调
 * @returns {React.ReactElement}
 */
function CommitsTab({ branches, branchData, activeBranch, onBranchChange }) {
  /**
   * 渲染单个提交项
   * @param {string} commitText - 提交文本
   * @param {number} index - 索引
   * @returns {React.ReactElement}
   */
  const renderCommit = (commitText, index) => {
    // 解析提交格式：提交消息 (链接)
    const linkMatch = commitText.match(
      /(.*?)\s*\(<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>\)/
    );

    if (linkMatch) {
      const [, message, url, hash] = linkMatch;
      return (
        <div
          key={index}
          className="commit-item p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-gray-800 font-medium mb-1">{message.trim()}</p>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-mono bg-gray-100 text-gray-600">
                  <i className="fas fa-code-commit mr-1"></i>
                  {hash}
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs"
                >
                  <i className="fas fa-external-link-alt mr-1"></i>
                  查看提交
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 如果没有匹配到链接格式，直接显示原文
    return (
      <div
        key={index}
        className="commit-item p-3 rounded-lg border border-gray-200"
      >
        <p
          className="text-gray-800"
          dangerouslySetInnerHTML={{ __html: commitText }}
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-code-commit mr-3 text-purple-500"></i>
          提交记录
        </h2>

        {branches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-code-branch text-4xl mb-4 opacity-50"></i>
            <p>暂无提交记录</p>
          </div>
        ) : (
          <div>
            {/* 分支导航 */}
            <div className="branch-nav">
              {branches.map((branchName) => (
                <button
                  key={branchName}
                  onClick={() => onBranchChange(branchName)}
                  className={`branch-tab ${
                    activeBranch === branchName ? "active" : ""
                  }`}
                >
                  <i className="fas fa-code-branch mr-2"></i>
                  {branchName}
                  <span className="ml-2 text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {branchData[branchName]?.length || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* 分支内容展示 */}
            {activeBranch && branchData[activeBranch] && (
              <div className="content-transition p-6">
                <div className="space-y-3">
                  {branchData[activeBranch].map((commit, index) =>
                    renderCommit(commit, index)
                  )}
                </div>

                {/* 分支统计信息 */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <i className="fas fa-code-branch mr-2"></i>
                      {activeBranch} 分支
                    </span>
                    <span className="flex items-center">
                      <i className="fas fa-list-ol mr-2"></i>共{" "}
                      {branchData[activeBranch]?.length || 0} 个提交
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ES6 默认导出
export default CommitsTab;
