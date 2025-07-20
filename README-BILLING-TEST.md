# 🧪 GitHub Actions 计费测试

这个项目包含简单的 GitHub Actions workflows 来测试公开仓库的计费情况。

## 📋 测试文件

### 1. `test-billing.yml`
- 🐧 在 Ubuntu 上运行 (~25秒)
- 🍎 在 macOS 上运行 (~25秒)  
- 📊 显示摘要信息

### 2. `quick-test.yml`
- ⚡ 仅在 Ubuntu 上运行 (~30秒)
- 🎯 最简单的测试

## 🔍 如何测试

1. **推送代码到 main 分支** 或 **手动触发 workflow**
2. **观察 Actions 运行情况**
3. **检查计费页面**: https://github.com/settings/billing/summary

## 📖 预期结果

根据 GitHub 官方文档，标准运行器在公开仓库中应该是免费的：
- ✅ `ubuntu-latest` - 应该免费
- ✅ `macos-latest` - 应该免费  
- ✅ `windows-latest` - 应该免费

## ⚠️ 注意事项

- 只有 **larger runners** 在公开仓库中会收费
- 私有仓库会消耗免费分钟数或产生费用
- 存储 artifacts 可能产生存储费用

## 🔗 相关文档

- [GitHub Actions 计费说明](https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-actions)
- [运行器类型说明](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners)
