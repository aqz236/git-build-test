/**
 * OverviewTab组件 - 概览标签页内容
 * @param {Object} props
 * @param {import('./types.js').ReleaseData} props.releaseData
 * @param {boolean} props.copied - 是否已复制
 * @param {function(string): void} props.onCopy - 复制回调
 * @returns {React.ReactElement}
 */
function OverviewTab({ releaseData, copied, onCopy }) {
  /**
   * 格式化日期
   * @param {string} dateString - 日期字符串
   * @returns {string} 格式化后的日期
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-8">
      {/* Build Information */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-info-circle mr-3 text-blue-500"></i>
          构建信息
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="font-medium text-gray-700">发布版本</label>
              <p className="text-gray-600 mt-1">{releaseData.version}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">发布时间</label>
              <p className="text-gray-600 mt-1">
                {formatDate(releaseData.createdAt)}
              </p>
            </div>
            <div>
              <label className="font-medium text-gray-700">私有仓库提交</label>
              <div className="flex items-center mt-1">
                <code className="bg-gray-100 px-3 py-1 rounded mr-2">
                  {releaseData.commitHash}
                </code>
                <button
                  onClick={() => onCopy(releaseData.commitHash)}
                  className="copy-button p-1 rounded hover:bg-gray-100"
                  title="复制提交哈希"
                >
                  <i
                    className={`fas ${
                      copied
                        ? "fa-check text-green-500"
                        : "fa-copy text-gray-500"
                    }`}
                  ></i>
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="font-medium text-gray-700">触发事件</label>
              <p className="text-gray-600 mt-1">{releaseData.triggerEvent}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">触发仓库</label>
              <p className="text-gray-600 mt-1">{releaseData.triggerRepo}</p>
            </div>
            <div>
              <label className="font-medium text-gray-700">触发分支</label>
              <p className="text-gray-600 mt-1">{releaseData.triggerBranch}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Commit Message */}
      {releaseData.commitMessage &&
        releaseData.commitMessage !== "{{COMMIT_MESSAGE}}" && (
          <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-comment-alt mr-3 text-green-500"></i>
              提交消息
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {releaseData.commitMessage}
              </p>
            </div>
          </div>
        )}
    </div>
  );
}

// 暴露到全局作用域
window.OverviewTab = OverviewTab;
