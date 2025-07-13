# GitHub Release & Tags 管理器

这是一个基于TanStack生态构建的GitHub Release和Tags管理器，支持查看、搜索和批量管理GitHub仓库的发布版本和标签。

## 功能特性

### Releases 管理

- ✅ 分页查询releases
- ✅ 关键词搜索（支持release名称、描述、标签名搜索）
- ✅ 批量删除releases
- ✅ 查看发布状态（草稿、预发布、正式发布）
- ✅ 查看作者信息和发布时间
- ✅ 查看资源文件数量
- ✅ 直接跳转到GitHub页面

### Tags 管理

- ✅ 分页查询tags
- ✅ 查看commit SHA信息
- ✅ 复制commit SHA到剪贴板
- ✅ 下载ZIP/TAR格式的源码
- ✅ 直接跳转到commit页面

## 技术栈

- **前端框架**: React 19 + TanStack Start
- **路由**: TanStack Router
- **数据获取**: TanStack Query (React Query)
- **表格组件**: TanStack Table
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **GitHub API**: Octokit/rest

## 配置步骤

### 1. 获取GitHub Personal Access Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 设置token名称和过期时间
4. 选择以下权限：
   - `repo` - 访问私有仓库（如果需要）
   - `public_repo` - 访问公开仓库
   - `delete_repo` - 删除releases（如果需要删除功能）

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的配置：

\`\`\`bash
cp .env.example .env
\`\`\`

编辑 `.env` 文件：

\`\`\`env

# GitHub配置

VITE_GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_GITHUB_OWNER=your_github_username
VITE_GITHUB_REPO=your_repository_name
\`\`\`

### 3. 安装依赖

\`\`\`bash
bun install
\`\`\`

### 4. 启动开发服务器

\`\`\`bash
bun run dev
\`\`\`

访问 http://localhost:3000

## 使用说明

### Releases 管理

1. 在导航栏点击 "Releases" 进入releases管理页面
2. 使用搜索框输入关键词搜索特定的release
3. 选择要删除的releases，点击"删除选中"按钮进行批量删除
4. 点击"View"链接可以直接跳转到GitHub页面查看详情

### Tags 管理

1. 在导航栏点击 "Tags" 进入tags管理页面
2. 点击SHA旁边的复制按钮可以复制完整的commit SHA
3. 点击"ZIP"或"TAR"按钮可以下载对应格式的源码
4. 点击"View Commit"可以跳转到GitHub查看对应的commit

## 项目结构

\`\`\`
src/
├── components/
│ ├── ReleasesManager.tsx # Releases管理组件
│ └── TagsManager.tsx # Tags管理组件
├── routes/
│ ├── releases.tsx # Releases页面路由
│ └── tags.tsx # Tags页面路由
├── utils/
│ └── github.ts # GitHub API封装
└── styles/
└── app.css # 全局样式
\`\`\`

## 注意事项

1. **GitHub API限制**: 未认证请求每小时限制60次，认证请求每小时限制5000次
2. **删除操作**: 删除releases操作不可逆，请谨慎使用
3. **权限要求**: 某些操作可能需要相应的仓库权限
4. **Tags删除**: 当前实现不包含tags删除功能，因为需要特殊权限，建议通过Git命令行操作

## 开发命令

\`\`\`bash

# 启动开发服务器

bun run dev

# 构建生产版本

bun run build

# 启动生产服务器

bun run start

# 生成路由类型

bun run routes:generate
\`\`\`

## 后续优化建议

1. 添加更多筛选选项（按日期、作者等）
2. 添加批量操作的确认对话框优化
3. 添加数据导出功能
4. 支持多个仓库切换
5. 添加GitHub Actions集成
6. 添加更详细的错误处理和用户反馈
