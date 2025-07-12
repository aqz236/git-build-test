# 📋 GitHub Pages 发布系统

这是一个基于 GitHub Actions 的自动化发布页面生成系统，可以为每次发布创建美观的 GitHub Pages 页面。

## 🌟 特性

- ✨ **现代化 UI**: 使用 React + Tailwind CSS + FontAwesome 构建
- 📊 **发布历史**: 自动维护所有发布的历史记录
- 🔗 **智能链接**: 自动生成提交链接到源仓库
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🚀 **自动部署**: 通过 GitHub Actions 自动生成和部署

## 📁 项目结构

```
.github/
├── actions/
│   ├── generate-changelog/     # 生成变更日志的 Action
│   │   └── action.yml
│   └── generate-release-page/  # 生成发布页面的 Action
│       └── action.yml
└── workflows/
    └── build-and-deploy.yml    # 主要的构建和部署工作流

pages/                          # GitHub Pages 根目录
├── index.html                  # 主页面 - 显示所有发布
├── releases.json              # 发布数据文件
├── release-template.html      # 发布页面模板
└── {commit-hash}/             # 每个发布的目录
    └── index.html            # 发布详情页面
```

## 🚀 快速开始

### 1. 配置仓库

1. **启用 GitHub Pages**:

   - 进入仓库设置 → Pages
   - 选择 Source: "GitHub Actions"

2. **配置 Secrets** (如果使用私有仓库):
   ```
   PRIVATE_REPO_TOKEN: 用于访问私有仓库的 Personal Access Token
   ```

### 2. 配置工作流

编辑 `.github/workflows/build-and-deploy.yml` 文件:

```yaml
# 如果使用私有仓库，替换这些值：
repository: YOUR_ORG/YOUR_PRIVATE_REPO
token: ${{ secrets.PRIVATE_REPO_TOKEN }}
# 如果不使用私有仓库，删除私有仓库检出步骤
```

### 3. 触发发布

支持多种触发方式：

#### 方式 1: 手动触发

- 在 GitHub Actions 页面点击 "Run workflow"
- 输入版本号 (如: 1.0.0)

#### 方式 2: 推送触发

```bash
git push origin main    # 推送到 main 分支自动触发
git push origin dev     # 推送到 dev 分支自动触发
```

#### 方式 3: API 触发

```bash
curl -X POST \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/YOUR_OWNER/YOUR_REPO/dispatches \
  -d '{"event_type":"build","client_payload":{"version":"1.0.0"}}'
```

## 📋 Action 使用说明

### generate-changelog

生成变更日志的 Action。

```yaml
- name: 📋 Generate changelog
  uses: ./.github/actions/generate-changelog
  with:
    app-directory: app # 私有仓库目录 (默认: app)
    version: "1.0.0" # 版本号 (必需)
    commit-count: 10 # 每个分支显示的提交数量 (默认: 10)
    branches: "dev,main" # 要包含的分支列表 (默认: dev,main)
```

### generate-release-page

生成发布页面的 Action。

```yaml
- name: 🌐 Generate release page
  uses: ./.github/actions/generate-release-page
  with:
    app-directory: app # 私有仓库目录 (默认: app)
    version: "1.0.0" # 版本号 (必需)
    changelog: ${{ steps.changelog.outputs.changelog }} # 变更日志内容 (必需)
```

## 🎨 页面功能

### 主页面 (`pages/index.html`)

- 📊 显示所有发布的列表
- 🔍 发布状态和基本信息
- 🔗 链接到详细页面

### 发布详情页面 (`pages/{commit-hash}/index.html`)

- 📋 **概览标签**: 构建信息和提交消息
- 💻 **提交记录标签**: 分支提交历史
- 📦 **下载标签**: 下载说明和平台支持
- 🔧 **技术栈标签**: 项目技术栈展示

## 🛠️ 自定义配置

### 修改样式

编辑 `pages/index.html` 和 `pages/release-template.html` 中的 CSS:

```html
<style>
  /* 自定义渐变色 */
  .gradient-bg {
    background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
  }

  /* 自定义卡片样式 */
  .card-hover {
    /* 您的样式 */
  }
</style>
```

### 修改技术栈

在 `pages/release-template.html` 中修改技术栈部分:

```javascript
{[
    { name: 'Your Tech', icon: 'fas fa-icon', color: 'bg-color-500' },
    // 添加更多技术栈
].map((tech, index) => (
    // 技术栈卡片渲染
))}
```

### 自定义发布数据

修改 `pages/releases.json` 结构添加更多字段:

```json
{
  "releases": [
    {
      "version": "1.0.0",
      "commit_hash": "abcd1234",
      "custom_field": "your_value"
      // 添加更多字段
    }
  ]
}
```

## 📸 效果预览

### 主页面

- 现代化的渐变背景
- 响应式卡片布局
- 发布状态指示器
- 搜索和筛选功能

### 发布详情页面

- 标签页式导航
- 详细的构建信息
- 交互式提交历史
- 美观的下载指南

## 🔧 故障排除

### 常见问题

1. **Pages 部署失败**

   - 确保启用了 GitHub Pages
   - 检查 Actions 权限设置

2. **私有仓库访问失败**

   - 验证 `PRIVATE_REPO_TOKEN` 配置
   - 确保 token 有仓库读取权限

3. **页面显示异常**
   - 检查 `releases.json` 格式
   - 验证模板变量替换

### 调试步骤

1. 查看 GitHub Actions 日志
2. 检查 Pages 部署状态
3. 验证生成的文件内容
4. 测试本地 HTML 文件

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

---

<div align="center">
  <strong>🚀 让每次发布都值得纪念！</strong>
</div>
