/**
 * 组件统一导出入口
 */

// 导入所有组件
import App from './App.js';
import Header from './Header.js';
import Navigation from './Navigation.js';
import OverviewTab from './OverviewTab.js';
import CommitsTab from './CommitsTab.js';
import DownloadTab from './DownloadTab.js';
import TechTab from './TechTab.js';
import { parseChangelog, formatDate, copyToClipboard, fetchReleaseAssets } from './utils.js';

// 将所有组件和函数暴露到全局作用域，以便在HTML中使用
window.App = App;
window.Header = Header;
window.Navigation = Navigation;
window.OverviewTab = OverviewTab;
window.CommitsTab = CommitsTab;
window.DownloadTab = DownloadTab;
window.TechTab = TechTab;
window.parseChangelog = parseChangelog;
window.formatDate = formatDate;
window.copyToClipboard = copyToClipboard;
window.fetchReleaseAssets = fetchReleaseAssets;

// 也提供ES6导出，以便其他模块可以导入
export {
  App,
  Header,
  Navigation,
  OverviewTab,
  CommitsTab,
  DownloadTab,
  TechTab,
  parseChangelog,
  formatDate,
  copyToClipboard,
  fetchReleaseAssets
};

export default App;
