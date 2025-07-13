# 项目目录结构重构文档

## 重构概述

本项目已经从**技术分层**的目录结构重构为**功能模块**优先的架构，采用内聚的设计思维来组织代码。

## 新的目录结构

```
src/
├── app/                          # 应用层配置和路由
│   └── routes/                   # 主要路由配置
│       ├── __root.tsx           # 根路由
│       └── index.tsx            # 首页路由
├── shared/                       # 共享的组件、工具、类型
│   ├── components/              # 通用组件
│   └── utils/                   # 工具函数
│       └── seo.ts              # SEO工具
├── features/                     # 功能模块
│   └── github-manager/          # GitHub管理功能模块
│       ├── components/          # 该功能的所有组件
│       │   ├── GitHubManager.tsx
│       │   ├── ReleasesTable.tsx
│       │   ├── TagsTable.tsx
│       │   ├── SearchBar.tsx
│       │   ├── TabSwitcher.tsx
│       │   ├── Pagination.tsx
│       │   ├── BulkActions.tsx
│       │   ├── AssetsButton.tsx
│       │   ├── AssetsModal.tsx
│       │   ├── DownloadButton.tsx
│       │   ├── TagDownloadButton.tsx
│       │   ├── MarkdownViewer.tsx
│       │   ├── ConfirmDialog.tsx
│       │   ├── DefaultCatchBoundary.tsx
│       │   ├── NotFound.tsx
│       │   └── index.ts         # 组件统一导出
│       ├── hooks/               # 该功能的hooks
│       │   ├── useDebounceSearch.ts
│       │   └── index.ts
│       ├── services/            # API和数据处理
│       │   ├── github-api.ts    # GitHub API调用
│       │   └── index.ts
│       ├── store/               # 状态管理
│       │   ├── github-store.ts  # Zustand store
│       │   └── index.ts
│       ├── types/               # 类型定义（预留）
│       ├── routes/              # 功能路由（预留）
│       └── index.ts             # 功能模块统一导出
├── routes/                       # TanStack Router路由定义
│   ├── __root.tsx               # 根路由配置
│   ├── index.tsx                # 首页路由
│   └── github_releases_tags/    # GitHub管理器路由
│       └── index.tsx
├── styles/                       # 全局样式
│   └── app.css
├── router.tsx                    # 路由配置
└── routeTree.gen.ts             # 自动生成的路由树
```

## 重构前后对比

### 重构前（技术分层）

```
src/
├── components/
│   └── github_releases_tags/    # 所有GitHub相关组件
├── hooks/
│   └── github_releases_tags/    # GitHub相关hooks
├── utils/
│   └── github_releases_tags/    # GitHub相关工具和API
├── routes/
│   └── github_releases_tags/    # GitHub相关路由
└── styles/
```

### 重构后（功能模块）

```
src/
├── features/
│   └── github-manager/          # GitHub管理功能的所有代码
│       ├── components/          # 组件
│       ├── hooks/               # hooks
│       ├── services/            # API服务
│       ├── store/               # 状态管理
│       └── types/               # 类型定义
├── shared/                      # 公共代码
└── app/                         # 应用配置
```

## 重构优势

### 1. **高内聚**

- 每个功能模块的所有相关代码都在一个目录下
- 修改某个功能时，只需要在对应的feature目录下操作
- 代码职责边界清晰

### 2. **低耦合**

- 功能模块之间通过清晰的接口交互
- shared目录存放公共代码，避免重复
- 模块之间的依赖关系明确

### 3. **易维护**

- 查找代码更容易：想修改GitHub管理器的某个功能，直接去`features/github-manager`
- 新增功能简单：在`features`下创建新目录即可
- 删除功能干净：删除整个feature目录即可

### 4. **易扩展**

- 添加新功能模块：在`features`下创建新目录
- 每个模块可以有自己的组件、hooks、服务、状态管理
- 支持模块级别的懒加载

### 5. **团队协作友好**

- 不同开发者可以专注于不同的feature模块
- 减少代码冲突的可能性
- 代码审查更容易聚焦

## 导入路径规范

### 功能模块内部导入

```typescript
// 相对路径导入同模块内的代码
import { useGitHubStore } from "../store/github-store";
import { GitHubManager } from "./GitHubManager";
```

### 跨模块导入

```typescript
// 使用模块的主导出
import { GitHubManager } from "~/features/github-manager";

// 或者从shared导入公共代码
import { seo } from "~/shared/utils/seo";
```

## 模块导出规范

每个模块都有统一的导出文件：

- `components/index.ts` - 导出所有组件
- `hooks/index.ts` - 导出所有hooks
- `services/index.ts` - 导出所有服务
- `store/index.ts` - 导出状态管理
- `index.ts` - 模块主导出文件

## 未来扩展

当需要添加新功能时，比如"CI/CD管理器"：

```
src/features/cicd-manager/
├── components/
├── hooks/
├── services/
├── store/
├── types/
└── index.ts
```

按照相同的模式组织代码，保持架构的一致性。
