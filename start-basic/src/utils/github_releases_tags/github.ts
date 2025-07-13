import { Octokit } from "@octokit/rest";

// 创建GitHub API客户端
export const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

// GitHub配置
export const GITHUB_CONFIG = {
  owner: import.meta.env.VITE_GITHUB_OWNER,
  repo: import.meta.env.VITE_GITHUB_REPO,
};

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  };
  assets: Array<{
    id: number;
    name: string;
    download_count: number;
    size: number;
    browser_download_url: string;
  }>;
}

export interface GitHubTag {
  name: string;
  commit: {
    sha: string;
    url: string;
    message?: string; // commit message
  };
  zipball_url: string;
  tarball_url: string;
}

// 获取releases
export async function getReleases(page = 1, perPage = 10) {
  const response = await octokit.rest.repos.listReleases({
    owner: GITHUB_CONFIG.owner,
    repo: GITHUB_CONFIG.repo,
    page,
    per_page: perPage,
  });

  return {
    data: response.data as GitHubRelease[],
    hasNextPage: response.data.length === perPage,
    totalCount: parseInt(String(response.headers["x-total-count"] || "0")),
  };
}

// 获取tags
export async function getTags(page = 1, perPage = 10) {
  const response = await octokit.rest.repos.listTags({
    owner: GITHUB_CONFIG.owner,
    repo: GITHUB_CONFIG.repo,
    page,
    per_page: perPage,
  });

  return {
    data: response.data as GitHubTag[],
    hasNextPage: response.data.length === perPage,
  };
}

// 删除release
export async function deleteRelease(releaseId: number) {
  await octokit.rest.repos.deleteRelease({
    owner: GITHUB_CONFIG.owner,
    repo: GITHUB_CONFIG.repo,
    release_id: releaseId,
  });
}

// 批量删除releases
export async function bulkDeleteReleases(releaseIds: number[]) {
  const promises = releaseIds.map((id) => deleteRelease(id));
  await Promise.all(promises);
}

// 搜索releases（基于内容关键词）
export async function searchReleases(keyword: string, page = 1, perPage = 10) {
  const { data } = await getReleases(page, perPage);

  const filteredReleases = data.filter(
    (release) =>
      release.name?.toLowerCase().includes(keyword.toLowerCase()) ||
      release.body?.toLowerCase().includes(keyword.toLowerCase()) ||
      release.tag_name?.toLowerCase().includes(keyword.toLowerCase())
  );

  return {
    data: filteredReleases,
    hasNextPage: false, // 搜索结果不支持分页
  };
}

// 搜索tags（基于tag名称关键词）
export async function searchTags(keyword: string, page = 1, perPage = 10) {
  const { data } = await getTags(page, perPage);

  const filteredTags = data.filter((tag) =>
    tag.name?.toLowerCase().includes(keyword.toLowerCase())
  );

  return {
    data: filteredTags,
    hasNextPage: false, // 搜索结果不支持分页
  };
}
