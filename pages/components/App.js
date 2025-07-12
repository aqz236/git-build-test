import Header from './Header.js';
import Navigation from './Navigation.js';
import OverviewTab from './OverviewTab.js';
import CommitsTab from './CommitsTab.js';
import DownloadTab from './DownloadTab.js';
import TechTab from './TechTab.js';
import { parseChangelog, copyToClipboard, fetchReleaseAssets } from './utils.js';

/**
 * 主应用组件
 * @param {Object} props
 * @param {import('./types.js').ReleaseData} props.releaseData - 发布数据
 * @returns {React.ReactElement}
 */
function App({ releaseData }) {
  // 状态管理
  const [activeTab, setActiveTab] = React.useState("overview");
  const [activeBranch, setActiveBranch] = React.useState(null);
  const [copied, setCopied] = React.useState(false);
  const [branches, setBranches] = React.useState([]);
  const [branchData, setBranchData] = React.useState({});
  const [downloadFiles, setDownloadFiles] = React.useState([]);
  const [loadingAssets, setLoadingAssets] = React.useState(true);
  const [assetsError, setAssetsError] = React.useState(null);

  /**
   * 复制到剪贴板
   * @param {string} text - 要复制的文本
   */
  const handleCopy = async (text) => {
    try {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("复制失败:", error);
    }
  };

  /**
   * 获取release assets
   */
  const fetchAssets = async () => {
    setLoadingAssets(true);
    setAssetsError(null);

    try {
      const assets = await fetchReleaseAssets(
        releaseData.triggerRepo,
        releaseData.version,
        releaseData.releaseHash,
        releaseData.releaseHashShort
      );
      setDownloadFiles(assets);
    } catch (error) {
      console.error("❌ Error fetching release assets:", error);
      setAssetsError(`获取构建产物失败: ${error.message}`);
      setDownloadFiles([]);
    } finally {
      setLoadingAssets(false);
    }
  };

  // 初始化分支数据
  React.useEffect(() => {
    const parsedBranchData = parseChangelog(releaseData.changelog);
    const branchList = Object.keys(parsedBranchData);

    setBranchData(parsedBranchData);
    setBranches(branchList);

    if (branchList.length > 0 && !activeBranch) {
      setActiveBranch(branchList[0]);
    }
  }, []);

  // 获取assets
  React.useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="min-h-screen">
      <Header releaseData={releaseData} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="container mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <OverviewTab
            releaseData={releaseData}
            copied={copied}
            onCopy={handleCopy}
          />
        )}

        {activeTab === "commits" && (
          <CommitsTab
            branches={branches}
            branchData={branchData}
            activeBranch={activeBranch}
            onBranchChange={setActiveBranch}
          />
        )}

        {activeTab === "download" && (
          <DownloadTab
            downloadFiles={downloadFiles}
            loadingAssets={loadingAssets}
            assetsError={assetsError}
            onRetry={fetchAssets}
          />
        )}

        {activeTab === "tech" && <TechTab />}
      </main>
    </div>
  );
}

// ES6 默认导出
export default App;
