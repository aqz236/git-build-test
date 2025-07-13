import { Octokit } from '@octokit/rest';
import type { GitHubRelease, GitHubTag, GitHubCommit, RepositoryInfo, DeleteResponse } from '../../shared/types';

export class GitHubService {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(token: string, owner: string, repo: string) {
    this.octokit = new Octokit({ auth: token });
    this.owner = owner;
    this.repo = repo;
  }

  /**
   * 获取仓库信息
   */
  async getRepositoryInfo(): Promise<RepositoryInfo> {
    const { data } = await this.octokit.rest.repos.get({
      owner: this.owner,
      repo: this.repo,
    });

    return {
      owner: data.owner.login,
      name: data.name,
      full_name: data.full_name,
      description: data.description || '',
      html_url: data.html_url,
      default_branch: data.default_branch,
    };
  }

  /**
   * 获取所有 releases
   */
  async getReleases(): Promise<GitHubRelease[]> {
    const releases: GitHubRelease[] = [];
    let page = 1;
    const per_page = 100;

    while (true) {
      const { data } = await this.octokit.rest.repos.listReleases({
        owner: this.owner,
        repo: this.repo,
        page,
        per_page,
      });

      if (data.length === 0) break;

      releases.push(...data.map(release => ({
        id: release.id,
        tag_name: release.tag_name,
        name: release.name || release.tag_name,
        body: release.body || '',
        published_at: release.published_at || '',
        created_at: release.created_at,
        prerelease: release.prerelease,
        draft: release.draft,
        author: {
          login: release.author?.login || 'unknown',
          avatar_url: release.author?.avatar_url || '',
        },
        html_url: release.html_url,
        assets: release.assets.map(asset => ({
          id: asset.id,
          name: asset.name,
          size: asset.size,
          download_count: asset.download_count,
          browser_download_url: asset.browser_download_url,
          created_at: asset.created_at,
        })),
      })));

      if (data.length < per_page) break;
      page++;
    }

    return releases;
  }

  /**
   * 获取所有 tags
   */
  async getTags(): Promise<GitHubTag[]> {
    const tags: GitHubTag[] = [];
    let page = 1;
    const per_page = 100;

    while (true) {
      const { data } = await this.octokit.rest.repos.listTags({
        owner: this.owner,
        repo: this.repo,
        page,
        per_page,
      });

      if (data.length === 0) break;

      tags.push(...data.map(tag => ({
        name: tag.name,
        commit: {
          sha: tag.commit.sha,
          url: tag.commit.url,
        },
        zipball_url: tag.zipball_url,
        tarball_url: tag.tarball_url,
      })));

      if (data.length < per_page) break;
      page++;
    }

    return tags;
  }

  /**
   * 获取提交信息
   */
  async getCommits(sha: string): Promise<GitHubCommit> {
    const { data } = await this.octokit.rest.repos.getCommit({
      owner: this.owner,
      repo: this.repo,
      ref: sha,
    });

    return {
      sha: data.sha,
      commit: {
        message: data.commit.message,
        author: {
          name: data.commit.author?.name || 'unknown',
          email: data.commit.author?.email || '',
          date: data.commit.author?.date || '',
        },
      },
      author: data.author ? {
        login: data.author.login,
        avatar_url: data.author.avatar_url,
      } : null,
      html_url: data.html_url,
    };
  }

  /**
   * 删除单个 release
   */
  async deleteRelease(releaseId: number): Promise<boolean> {
    try {
      await this.octokit.rest.repos.deleteRelease({
        owner: this.owner,
        repo: this.repo,
        release_id: releaseId,
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete release ${releaseId}:`, error);
      return false;
    }
  }

  /**
   * 删除单个 tag
   */
  async deleteTag(tagName: string): Promise<boolean> {
    try {
      await this.octokit.rest.git.deleteRef({
        owner: this.owner,
        repo: this.repo,
        ref: `tags/${tagName}`,
      });
      return true;
    } catch (error) {
      console.error(`Failed to delete tag ${tagName}:`, error);
      return false;
    }
  }

  /**
   * 批量删除 releases
   */
  async deleteMultipleReleases(releaseIds: number[]): Promise<DeleteResponse> {
    const results = await Promise.allSettled(
      releaseIds.map(id => this.deleteRelease(id))
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;

    return {
      success: successful > 0,
      message: `Successfully deleted ${successful}/${releaseIds.length} releases`,
      deleted_count: successful,
    };
  }

  /**
   * 批量删除 tags
   */
  async deleteMultipleTags(tagNames: string[]): Promise<DeleteResponse> {
    const results = await Promise.allSettled(
      tagNames.map(name => this.deleteTag(name))
    );

    const successful = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;

    return {
      success: successful > 0,
      message: `Successfully deleted ${successful}/${tagNames.length} tags`,
      deleted_count: successful,
    };
  }
}
