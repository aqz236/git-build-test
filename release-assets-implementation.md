# 🚀 Release 页面动态构建产物获取 - 实现说明

## 📋 问题背景

用户反馈 release 页面只显示一个 README.md，而不是实际的构建产物。问题在于之前的逻辑试图在后端 workflow 中预先获取 release assets，但这存在时序问题。

## 🎯 解决方案

**采用前端动态 API 调用的方式**，更加优雅和可靠：

### 🔄 核心改进

#### 1. **简化后端逻辑**

- 移除了 action.yml 中复杂的 API 调用代码
- 后端只负责页面模板生成和基础信息传递
- 新增 `REPLACE_RELEASE_HASH` 和 `REPLACE_RELEASE_HASH_SHORT` 变量

#### 2. **前端动态获取**

在 release-template.html 中新增：

```javascript
// 新增状态管理
const [downloadFiles, setDownloadFiles] = useState([]);
const [loadingAssets, setLoadingAssets] = useState(true);
const [assetsError, setAssetsError] = useState(null);

// 动态获取release assets的函数
const fetchReleaseAssets = async () => {
  // 方法1: 通过版本号获取
  // 方法2: 通过commit hash匹配
  // 方法3: 使用最新release作为fallback
};
```

#### 3. **多重查找策略**

```javascript
// 1. 优先通过版本号获取
GET / repos / { owner } / { repo } / releases / tags / { version };

// 2. 如果版本号找不到，搜索所有releases
GET / repos / { owner } / { repo } / releases;
// 然后匹配 target_commitish

// 3. 最后使用最新release作为fallback
GET / repos / { owner } / { repo } / releases / latest;
```

#### 4. **用户体验优化**

- 📊 **加载状态**：显示"正在加载构建产物..."
- ❌ **错误处理**：显示错误信息和重试按钮
- ✅ **成功状态**：显示所有构建产物
- 📭 **空状态**：显示"暂无可下载的构建产物"

## 🔧 技术细节

### API 调用逻辑

```javascript
// 使用release hash作为页面路径的唯一标识
RELEASE_HASH = github.sha  // 完整commit hash
RELEASE_HASH_SHORT = github.sha的前7位

// 页面URL格式
https://aqz236.github.io/git-build-test/{RELEASE_HASH}/
```

### 查找匹配逻辑

```javascript
// 查找条件
release.target_commitish === releaseData.releaseHash ||
  release.target_commitish === releaseData.releaseHashShort ||
  release.target_commitish?.startsWith(releaseData.releaseHashShort);
```

## 🎉 优势

### ✅ **时序独立**

- 前端页面加载后再获取 assets，避免时序问题
- 即使 workflow 中还没有创建 release，也能在后续获取

### ✅ **容错能力强**

- 多种查找策略，增强匹配成功率
- 优雅的错误处理和用户反馈

### ✅ **实时更新**

- 每次访问页面都会获取最新的 assets 信息
- 支持手动重试加载

### ✅ **维护简单**

- 后端逻辑大幅简化
- 前端逻辑清晰，便于调试和维护

## 📝 使用说明

### 对于开发者

1. 后端 action.yml 现在只需要传递基础信息
2. 前端会自动处理 assets 获取和显示
3. 所有 API 调用日志都会在浏览器控制台中显示

### 对于用户

1. 访问 release 页面时会看到加载状态
2. 成功加载后显示所有可用的构建产物
3. 如果加载失败，可以点击重试按钮

## 🚀 下一步

这个改进使得 release 页面能够可靠地显示对应 release 的所有构建产物，解决了之前只显示 README.md 的问题。每次提交都会有唯一的页面 URL，并且能够准确获取对应的构建产物信息。
