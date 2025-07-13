# GitHub Release & Tags Manager

一个现代化的可视化工具，用于管理GitHub仓库的releases和tags。基于Bun + TypeScript + React + TanStack Query构建。

## ✨ 功能特性

- 🏷️ **Releases管理**: 查看、删除单个或批量releases
- 🔖 **Tags管理**: 查看、删除单个或批量tags  
- 📊 **详细信息**: 显示完整的release和tag信息，包括提交详情、资源文件等
- 🚀 **批量操作**: 支持选择多个项目进行批量删除
- ⚡ **高性能**: 使用异步并发删除，大幅提升操作效率
- 🎨 **现代UI**: 基于Tailwind CSS的响应式界面
- 🔄 **实时更新**: 使用React Query进行智能缓存和数据同步

## 🏗️ 项目结构

```
web-manager/
├── src/
│   ├── client/           # React前端
│   │   ├── components/   # React组件
│   │   ├── hooks/        # React Query hooks
│   │   ├── services/     # API客户端
│   │   ├── App.tsx       # 主应用组件
│   │   └── index.tsx     # 客户端入口
│   ├── server/           # Bun服务端
│   │   ├── routes/       # API路由
│   │   ├── services/     # GitHub API服务
│   │   └── index.ts      # 服务端入口
│   └── shared/           # 共享类型定义
│       └── types.ts      # TypeScript类型
├── public/               # 静态文件
│   └── index.html        # HTML模板
├── package.json          # 依赖配置
├── tsconfig.json         # TypeScript配置
└── index.ts              # 项目入口
```

## 🚀 快速开始

### 1. 环境要求

- [Bun](https://bun.sh) >= 1.0
- Node.js >= 18 (可选，主要使用Bun)
- GitHub Personal Access Token

### 2. 安装依赖

\`\`\`bash
cd web-manager
bun install
\`\`\`

### 3. 配置环境变量

复制环境变量示例文件：

\`\`\`bash
cp .env.example .env
\`\`\`

编辑 \`.env\` 文件：

\`\`\`bash
# GitHub Token (必需)
GITHUB_TOKEN=your_github_token_here

# GitHub仓库信息 (必需)
GITHUB_OWNER=your_username
GITHUB_REPO=your_repository

# 服务器端口 (可选)
PORT=3000
\`\`\`

### 4. 创建GitHub Token

1. 访问 [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择以下权限：
   - \`repo\` - 完整的仓库访问权限
   - \`read:org\` - 读取组织信息
   - \`admin:public_key\` - 管理公钥
   - \`delete_repo\` - 删除仓库内容（用于删除releases/tags）

### 5. 启动开发服务器

\`\`\`bash
bun run dev
\`\`\`

访问 [http://localhost:3000](http://localhost:3000)

## 📝 可用脚本

\`\`\`bash
# 开发模式（热重载）
bun run dev

# 生产模式
bun run start

# 构建前端资源
bun run build

# 类型检查
bun run type-check
\`\`\`

## 🔧 API端点

### Repository
- \`GET /api/repository\` - 获取仓库信息

### Releases  
- \`GET /api/releases\` - 获取所有releases
- \`DELETE /api/releases/:id\` - 删除单个release
- \`DELETE /api/releases/batch\` - 批量删除releases

### Tags
- \`GET /api/tags\` - 获取所有tags  
- \`DELETE /api/tags/:name\` - 删除单个tag

### Commits
- \`GET /api/commits/:sha\` - 获取提交信息

## 🛡️ 安全注意事项

- ⚠️ **谨慎删除**: 删除releases和tags是不可逆操作
- 🔒 **Token安全**: 不要在代码中硬编码GitHub token
- 🔐 **权限控制**: 只授予必要的最小权限
- 🚫 **生产环境**: 生产环境使用时请备份重要数据

## 🎨 技术栈

### 后端
- **Runtime**: [Bun](https://bun.sh) - 极快的JavaScript运行时
- **Language**: TypeScript - 类型安全
- **API**: [Octokit](https://github.com/octokit/rest.js) - GitHub REST API客户端

### 前端  
- **Framework**: [React 19](https://react.dev) - 现代React
- **State Management**: [TanStack Query](https://tanstack.com/query) - 服务端状态管理
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - 实用优先的CSS框架
- **Icons**: [Font Awesome](https://fontawesome.com) - 图标库

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT LicenseTo install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
