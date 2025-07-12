# GitHub Actions 工作流说明

本项目采用模块化的 GitHub Actions 工作流设计，遵循单一职责原则，便于维护和复用。

## 📁 目录结构

```
.github/
├── actions/                    # 可重用的复合动作
│   ├── clone-private-repo/     # 克隆私有仓库
│   ├── generate-version/       # 生成版本号
│   ├── build-app/             # 构建应用程序
│   ├── package-encrypt/        # 打包和加密
│   └── generate-changelog/     # 生成变更日志
├── workflows/                  # 工作流文件
│   ├── build.yml              # 构建工作流（可重用）
│   ├── build-only.yml         # 仅构建工作流（PR和测试）
│   ├── release.yml            # 发布工作流（可重用）
│   ├── test.yml               # 测试工作流
│   └── build-and-release-pipeline.yml  # 主管道工作流
└── README.md                  # 本文档
```

## 🔧 工作流说明

### 1. 主管道工作流 (`build-and-release-pipeline.yml`)

- **用途**: 协调构建和发布流程，内联发布逻辑
- **触发**: push、workflow_dispatch、repository_dispatch
- **职责**: 调用构建工作流，然后直接执行发布步骤

### 2. 构建工作流 (`build.yml`)

- **用途**: 构建多平台应用程序（可重用）
- **触发**: 被主管道调用，或独立触发
- **职责**:
  - 克隆私有仓库
  - 生成版本号
  - 构建应用程序
  - 打包和加密
  - 上传构建产物

### 3. 仅构建工作流 (`build-only.yml`)

- **用途**: 仅构建，不发布（用于 PR 和测试）
- **触发**: PR、手动触发
- **职责**: 与构建工作流相同，但不触发发布

### 4. 发布工作流 (`release.yml`)

- **用途**: 创建 GitHub Release（可重用，独立使用）
- **触发**: 手动触发或其他工作流调用
- **职责**:
  - 生成变更日志
  - 下载构建产物
  - 创建 GitHub Release

### 5. 测试工作流 (`test.yml`)

- **用途**: 运行代码测试和 lint
- **触发**: PR、push
- **职责**:
  - 代码检查
  - 运行测试（如果存在）

## 🧩 复合动作说明

### 1. `clone-private-repo`

- **用途**: 克隆私有仓库
- **输入**: repository-url, github-token, target-directory
- **输出**: repo-path

### 2. `generate-version`

- **用途**: 根据触发类型生成版本号
- **输入**: app-directory
- **输出**: version, is-prerelease, private-commit, private-commit-short

### 3. `build-app`

- **用途**: 构建应用程序
- **输入**: app-directory, executable-name, platform
- **输出**: 无

### 4. `package-encrypt`

- **用途**: 打包并加密构建产物
- **输入**: app-directory, executable-name, version, artifact-name, encryption-password, platform
- **输出**: package-name

### 5. `generate-changelog`

- **用途**: 生成变更日志
- **输入**: app-directory, version, commit-count, branches
- **输出**: changelog

## 📋 配置参数

### 环境变量

- `CHANGELOG_COMMIT_COUNT`: 每个分支显示的提交数量 (默认: 10)
- `CHANGELOG_BRANCHES`: 要显示的分支列表 (默认: "dev,main")
- `ARTIFACT_RETENTION_DAYS`: 构建产物保留天数 (默认: 30)

### Secrets

- `REPOSITORY_URL`: 私有仓库 URL
- `SELF_GITHUB_SECRETS`: GitHub 访问令牌
- `COMPRESSED_PASSWORD`: 7z 加密密码
- `GITHUB_TOKEN`: GitHub 操作令牌 (自动提供)

## 🚀 使用方式

### 自动触发

1. **推送到 main/dev 分支**: 自动触发构建和发布
2. **创建标签**: 触发正式版本发布
3. **Repository Dispatch**: 远程触发构建

### 手动触发

1. 在 Actions 页面选择对应的工作流
2. 点击 "Run workflow" 按钮
3. 选择分支并执行

## 🔄 工作流程

```mermaid
graph TD
    A[Push/PR/Dispatch] --> B[Test Workflow]
    A --> C[Build Workflow]
    C --> D[Release Workflow]

    C --> E[Clone Repo]
    C --> F[Generate Version]
    C --> G[Build App]
    C --> H[Package & Encrypt]
    C --> I[Upload Artifacts]

    D --> J[Generate Changelog]
    D --> K[Download Artifacts]
    D --> L[Create Release]
```

## 🎯 优势

1. **单一职责**: 每个工作流和动作都有明确的职责
2. **可重用性**: 复合动作可以在多个工作流中重用
3. **可维护性**: 模块化设计便于维护和更新
4. **可测试性**: 可以独立测试每个组件
5. **灵活性**: 可以独立运行任何工作流
6. **可扩展性**: 易于添加新的功能和平台支持

## 🎯 最新优化 (2025-07-12)

### 🔄 版本号策略优化
- **改进**: 版本号现在包含精确到秒的时间戳 (`v20250712-205900-abc1234`)
- **目的**: 确保每次私有仓库的提交都生成唯一的 Release
- **效果**: 避免版本号重复，每次构建都有独特标识

### 📋 Changelog 用户体验优化
1. **折叠显示**: 发布信息和触发信息默认折叠，点击展开
2. **分层折叠**: 使用说明包含三个二级折叠项（下载、解压、macOS注意事项）
3. **新标签页链接**: 提交记录链接在新标签页打开，不影响当前页面浏览
4. **更好的信息层次**: 重要信息突出显示，详细信息按需查看

### 🔧 技术实现
- 使用 `<details>` 和 `<summary>` HTML 标签实现折叠
- 提交链接使用 `<a href="..." target="_blank">` 格式
- 时间戳格式: `YYYYMMDD-HHMMSS` 精确到秒

## 🔧 自定义配置

### 添加新平台

1. 在 `build.yml` 的 matrix 中添加新的操作系统
2. 在 `build-app` 动作中添加平台特定的处理逻辑

### 修改版本策略

1. 编辑 `generate-version` 动作
2. 调整版本生成逻辑

### 自定义变更日志

1. 编辑 `generate-changelog` 动作
2. 修改分支和提交展示逻辑

## 🐛 故障排除

### 常见问题

1. **构建失败**: 检查私有仓库访问权限和依赖
2. **发布失败**: 检查 GITHUB_TOKEN 权限
3. **加密失败**: 检查 COMPRESSED_PASSWORD 设置
4. **版本重复**: 检查版本生成逻辑和标签创建
5. **artifacts 找不到**: 工作流调用时 artifacts 传递问题，已通过内联发布逻辑解决
6. **测试失败**: package.json 中没有测试脚本或为占位符，已改为警告而非错误

### 已修复的问题

#### Artifacts 传递问题

- **问题**: 使用 `workflow_call` 时，artifacts 不会自动传递
- **解决方案**: 将发布逻辑内联到主管道工作流中，确保在同一 runner 上执行
- **影响**: 现在 artifacts 可以正确传递给发布步骤

#### 测试脚本问题

- **问题**: package.json 中的测试脚本为占位符（`echo "Error: no test specified" && exit 1`）
- **解决方案**: 检测占位符脚本并跳过测试，而不是报错
- **影响**: 现在没有真实测试时会显示警告而不是失败

### 调试技巧

1. 启用工作流的调试日志
2. 检查各步骤的输出
3. 使用 workflow_dispatch 手动测试
4. 查看 Actions 页面的详细日志
5. 检查 artifacts 上传和下载步骤的日志
