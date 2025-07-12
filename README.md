# 🚀 NextJS 静态部署 GitHub Actions

这个仓库配置了自动化的 GitHub Actions 工作流，用于部署基于 TitanJS 脚手架的 NextJS 静态站点到 GitHub Pages。

## 🛠️ 技术栈

- **NextJS 15.3.4** - React 框架
- **Bun** - JavaScript 运行时和包管理器
- **GitHub Actions** - CI/CD 自动化
- **GitHub Pages** - 静态站点托管

## 📋 前置要求

1. **GitHub Secrets 配置**：
   - `REPOSITORY_URL`: 您的 NextJS 项目仓库 URL
   - `SELF_GITHUB_SECRETS`: GitHub Personal Access Token

2. **项目配置**：
   - 确保您的 NextJS 项目启用了静态导出 (`output: 'export'`)
   - 项目使用 Bun 作为包管理器
   - 包含 `bun.lockb` 文件

## 🚀 部署流程

### 自动触发

工作流会在以下情况自动运行：
- 推送到 `main` 或 `dev` 分支
- Repository dispatch 事件 (类型: `build`)

### 手动触发

您也可以通过 GitHub Actions 页面手动触发部署：
1. 前往 Actions 标签页
2. 选择 "🚀 NextJS Static Deploy" 工作流
3. 点击 "Run workflow"
4. 选择要部署的分支

## 📁 项目结构要求

您的 NextJS 项目应该具有以下结构：

```
your-nextjs-project/
├── package.json
├── bun.lockb
├── next.config.ts (或 next.config.js)
├── app/ (或 pages/)
├── public/
└── ...其他文件
```

## ⚙️ Next.js 配置

确保您的 `next.config.ts` 包含静态导出配置：

```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  // 如果部署到子路径，请配置 basePath
  // basePath: '/your-repo-name',
}
```

## 📦 Bun 脚本

确保您的 `package.json` 包含正确的构建脚本：

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 🔧 工作流功能

### 构建步骤

1. **📥 代码检出** - 获取最新代码
2. **📥 克隆私有仓库** - 从您的项目仓库克隆代码
3. **🟢 设置 Node.js** - 安装 Node.js 20
4. **🥖 设置 Bun** - 安装最新版本的 Bun
5. **📦 安装依赖** - 使用 `bun install --frozen-lockfile`
6. **🔨 构建应用** - 使用 `bun run build`
7. **📤 导出静态文件** - 复制构建产物
8. **🌐 配置 Pages** - 设置 GitHub Pages
9. **🚀 部署** - 部署到 GitHub Pages

### 版本管理

- **🏷️ 版本确定** - 自动生成版本号
- **📋 变更日志** - 生成更新日志
- **🏷️ GitHub Release** - 创建 GitHub 发布

## 📊 部署状态

部署完成后，您可以：

1. 在 Actions 页面查看详细的部署日志
2. 访问 GitHub Pages URL 查看部署的站点
3. 在 Releases 页面查看版本发布记录

## 🐛 故障排除

### 常见问题

1. **构建失败**：
   - 检查 `next.config.ts` 是否正确配置静态导出
   - 确保项目没有使用不兼容静态导出的功能

2. **依赖安装失败**：
   - 确保 `bun.lockb` 文件存在且最新
   - 检查 `package.json` 中的依赖版本

3. **页面显示空白**：
   - 检查是否需要配置 `basePath` 和 `assetPrefix`
   - 确保图片优化已禁用 (`images.unoptimized: true`)

### 调试建议

- 查看 GitHub Actions 运行日志
- 检查 GitHub Pages 设置是否正确
- 确认 Secrets 配置是否完整

## 📞 支持

如果遇到问题，请：
1. 检查 Actions 运行日志
2. 查看 GitHub Issues
3. 联系项目维护者