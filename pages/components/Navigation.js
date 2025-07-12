/**
 * Navigation组件 - 导航标签页
 * @param {Object} props
 * @param {string} props.activeTab - 当前激活的标签
 * @param {function(string): void} props.onTabChange - 标签切换回调
 * @returns {React.ReactElement}
 */
function Navigation({ activeTab, onTabChange }) {
  /** @type {import('./types.js').TabConfig[]} */
  const tabs = [
    { id: "overview", label: "概览", icon: "fas fa-chart-line" },
    { id: "commits", label: "提交记录", icon: "fas fa-code-commit" },
    { id: "download", label: "下载", icon: "fas fa-download" },
    { id: "tech", label: "技术栈", icon: "fas fa-cogs" },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
