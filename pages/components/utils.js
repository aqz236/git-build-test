/**
 * 工具函数集合
 */

/**
 * 解析changelog为分支数据
 * @param {string} changelog - 变更日志字符串
 * @returns {Record<string, string[]>} 分支数据对象
 */
function parseChangelog(changelog) {
  /** @type {Record<string, string[]>} */
  const branchData = {};
  const lines = changelog.split("\n");
  let currentBranch = null;
  /** @type {string[]} */
  let currentCommits = [];

  lines.forEach((line) => {
    // 匹配分支标题，例如：#### 📋 `dev` 分支最新提交
    const branchMatch = line.match(/####.*`([^`]+)`.*分支最新提交/);
    if (branchMatch) {
      // 保存之前的分支数据
      if (currentBranch && currentCommits.length > 0) {
        branchData[currentBranch] = currentCommits;
      }
      currentBranch = branchMatch[1];
      currentCommits = [];
    }
    // 匹配提交项，以 "  - " 开头
    else if (line.trim().match(/^-\s+/) && currentBranch) {
      const commitText = line.replace(/^\s*-\s*/, "").trim();
      if (commitText) {
        currentCommits.push(commitText);
      }
    }
  });

  // 保存最后一个分支的数据
  if (currentBranch && currentCommits.length > 0) {
    branchData[currentBranch] = currentCommits;
  }

  console.log("Parsed branch data:", branchData);
  return branchData;
}

/**
 * 格式化日期
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化后的日期
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<void>}
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback: Unable to copy", err);
    }
    document.body.removeChild(textArea);
  }
}

/**
 * 获取release assets
 * @param {string} repository - 仓库名称
 * @param {string} version - 版本号
 * @param {string} releaseHash - 发布哈希
 * @param {string} releaseHashShort - 发布哈希短版本
 * @returns {Promise<import('./types.js').DownloadFile[]>}
 */
async function fetchReleaseAssets(
  repository,
  version,
  releaseHash,
  releaseHashShort
) {
  const apiBase = `https://api.github.com/repos/${repository}`;

  console.log("🔍 Fetching release assets...");
  console.log("Repository:", repository);
  console.log("Tag Name:", version);
  console.log("Release Hash:", releaseHash);

  // 直接通过tag名称获取release（最可靠的方法）
  console.log(`📦 Fetching release by tag: ${version}`);
  const versionResponse = await fetch(`${apiBase}/releases/tags/${version}`);

  if (versionResponse.ok) {
    const releaseInfo = await versionResponse.json();
    console.log("✅ Found release by tag:", version);
    console.log("🎯 Release target commit:", releaseInfo.target_commitish);

    if (releaseInfo.assets && releaseInfo.assets.length > 0) {
      const assets = releaseInfo.assets.map((asset) => ({
        name: asset.name,
        size: asset.size,
        browser_download_url: asset.browser_download_url,
        download_count: asset.download_count,
        content_type: asset.content_type,
        updated_at: asset.updated_at,
      }));

      console.log(
        `✅ Successfully loaded ${assets.length} assets:`,
        assets.map((a) => a.name)
      );
      return assets;
    } else {
      console.log("⚠️ Release found but no assets available");
      return [];
    }
  } else {
    console.log("❌ Release not found by tag:", version);

    // Fallback: 搜索所有releases找匹配的commit
    console.log("🔍 Searching all releases for matching commit...");
    const allReleasesResponse = await fetch(`${apiBase}/releases?per_page=50`);

    if (allReleasesResponse.ok) {
      const allReleases = await allReleasesResponse.json();
      console.log(`📋 Found ${allReleases.length} total releases`);

      const matchingRelease = allReleases.find(
        (release) =>
          release.target_commitish === releaseHash ||
          release.target_commitish === releaseHashShort ||
          release.target_commitish?.startsWith(releaseHashShort)
      );

      if (matchingRelease && matchingRelease.assets?.length > 0) {
        const assets = matchingRelease.assets.map((asset) => ({
          name: asset.name,
          size: asset.size,
          browser_download_url: asset.browser_download_url,
          download_count: asset.download_count,
          content_type: asset.content_type,
          updated_at: asset.updated_at,
        }));

        console.log(
          `🎯 Found matching release by commit: ${matchingRelease.tag_name}`,
          assets.map((a) => a.name)
        );
        return assets;
      } else {
        console.log("❌ No matching release found by commit");
        return [];
      }
    } else {
      throw new Error(
        `HTTP ${allReleasesResponse.status}: ${allReleasesResponse.statusText}`
      );
    }
  }
}

// 暴露到全局作用域
window.parseChangelog = parseChangelog;
window.formatDate = formatDate;
window.copyToClipboard = copyToClipboard;
window.fetchReleaseAssets = fetchReleaseAssets;
