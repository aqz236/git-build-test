/**
 * DownloadTab组件 - 下载标签页内容
 * @param {Object} props
 * @param {import('./types.js').DownloadFile[]} props.downloadFiles - 下载文件列表
 * @param {boolean} props.loadingAssets - 是否正在加载
 * @param {string|null} props.assetsError - 错误信息
 * @param {function(): void} props.onRetry - 重试回调
 * @returns {React.ReactElement}
 */
function DownloadTab({ downloadFiles, loadingAssets, assetsError, onRetry }) {
  /**
   * 渲染单个下载文件
   * @param {import('./types.js').DownloadFile} file - 文件信息
   * @param {number} index - 索引
   * @returns {React.ReactElement}
   */
  const renderDownloadFile = (file, index) => {
    const isPlatformFile =
      file.name.includes("darwin") || file.name.includes("linux");
    const platform = file.name.includes("darwin")
      ? "macOS"
      : file.name.includes("linux")
      ? "Linux"
      : "Other";
    const platformIcon = file.name.includes("darwin")
      ? "fab fa-apple"
      : file.name.includes("linux")
      ? "fab fa-linux"
      : "fas fa-file";

    return (
      <div
        key={index}
        className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-green-300 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1">
            <div className="mr-4">
              <i
                className={`${platformIcon} text-2xl ${
                  file.name.includes("darwin")
                    ? "text-gray-600"
                    : file.name.includes("linux")
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              ></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">{file.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {isPlatformFile && (
                  <span className="flex items-center">
                    <i className="fas fa-desktop mr-1"></i>
                    {platform}
                  </span>
                )}
                <span className="flex items-center">
                  <i className="fas fa-file-archive mr-1"></i>
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </span>
                <span className="flex items-center">
                  <i className="fas fa-clock mr-1"></i>
                  {new Date(file.updated_at).toLocaleDateString("zh-CN")}
                </span>
              </div>
            </div>
          </div>
          <a
            href={file.browser_download_url}
            download
            className="download-badge text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center font-medium"
          >
            <i className="fas fa-download mr-2"></i>
            下载
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Download Files */}
      <div className="bg-white rounded-xl shadow-lg p-8 card-hover">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-download mr-3 text-green-500"></i>
          构建产物下载
        </h2>

        {/* Download Files List */}
        {loadingAssets ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            <span className="ml-3 text-gray-600">正在加载构建产物...</span>
          </div>
        ) : assetsError ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-red-500 mr-3"></i>
              <span className="text-red-700">{assetsError}</span>
            </div>
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              重试加载
            </button>
          </div>
        ) : downloadFiles && downloadFiles.length > 0 ? (
          <div className="grid gap-4 mb-8">
            {downloadFiles.map((file, index) =>
              renderDownloadFile(file, index)
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-inbox text-4xl mb-4"></i>
            <p>暂无可下载的构建产物</p>
          </div>
        )}

        {/* Download Instructions */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">使用说明</h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* macOS */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <i className="fab fa-apple mr-2 text-gray-600"></i>
                macOS
              </h4>
              <div className="space-y-3 text-sm">
                <p>
                  1. 下载{" "}
                  <code className="bg-white px-2 py-1 rounded">
                    app-*-darwin-x64.7z
                  </code>
                </p>
                <p>2. 解压后添加执行权限:</p>
                <pre className="p-3 text-xs">
                  <code>chmod +x app-*-darwin-x64 && ./app-*-darwin-x64</code>
                </pre>
                <p className="text-amber-600">
                  <i className="fas fa-exclamation-triangle mr-1"></i>
                  如遇安全提示，请在系统偏好设置中允许运行
                </p>
              </div>
            </div>

            {/* Linux */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center">
                <i className="fab fa-linux mr-2 text-blue-600"></i>
                Linux
              </h4>
              <div className="space-y-3 text-sm">
                <p>
                  1. 下载{" "}
                  <code className="bg-white px-2 py-1 rounded">
                    app-*-linux-x64.7z
                  </code>
                </p>
                <p>2. 解压后添加执行权限:</p>
                <pre className="p-3 text-xs">
                  <code>chmod +x app-*-linux-x64 && ./app-*-linux-x64</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h4 className="font-bold text-amber-800 mb-3 flex items-center">
              <i className="fas fa-shield-alt mr-2"></i>
              安全说明
            </h4>
            <div className="text-amber-700 space-y-2 text-sm">
              <p>• 所有构建产物都经过密码加密的 7z 压缩包保护</p>
              <p>• 解压密码请联系管理员获取</p>
              <p>• 请确保从官方渠道下载，避免安全风险</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 暴露到全局作用域
window.DownloadTab = DownloadTab;
