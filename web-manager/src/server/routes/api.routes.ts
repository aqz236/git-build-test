import type { GitHubService } from '../services/github.service';
import type { BatchDeleteRequest } from '../../shared/types';

export function createApiRoutes(githubService: GitHubService) {
  return {
    /**
     * 获取仓库信息
     */
    async getRepository() {
      try {
        const data = await githubService.getRepositoryInfo();
        return Response.json({ success: true, data });
      } catch (error) {
        console.error('Failed to fetch repository info:', error);
        return Response.json(
          { success: false, error: 'Failed to fetch repository info' },
          { status: 500 }
        );
      }
    },

    /**
     * 获取所有 releases
     */
    async getReleases() {
      try {
        const data = await githubService.getReleases();
        return Response.json({ success: true, data });
      } catch (error) {
        console.error('Failed to fetch releases:', error);
        return Response.json(
          { success: false, error: 'Failed to fetch releases' },
          { status: 500 }
        );
      }
    },

    /**
     * 获取所有 tags
     */
    async getTags() {
      try {
        const data = await githubService.getTags();
        return Response.json({ success: true, data });
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        return Response.json(
          { success: false, error: 'Failed to fetch tags' },
          { status: 500 }
        );
      }
    },

    /**
     * 获取提交信息
     */
    async getCommit(sha: string) {
      try {
        const data = await githubService.getCommits(sha);
        return Response.json({ success: true, data });
      } catch (error) {
        console.error(`Failed to fetch commit ${sha}:`, error);
        return Response.json(
          { success: false, error: 'Failed to fetch commit' },
          { status: 500 }
        );
      }
    },

    /**
     * 删除单个 release
     */
    async deleteRelease(releaseId: number) {
      try {
        const success = await githubService.deleteRelease(releaseId);
        if (success) {
          return Response.json({ success: true, message: 'Release deleted successfully' });
        } else {
          return Response.json(
            { success: false, error: 'Failed to delete release' },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error(`Failed to delete release ${releaseId}:`, error);
        return Response.json(
          { success: false, error: 'Failed to delete release' },
          { status: 500 }
        );
      }
    },

    /**
     * 删除单个 tag
     */
    async deleteTag(tagName: string) {
      try {
        const success = await githubService.deleteTag(tagName);
        if (success) {
          return Response.json({ success: true, message: 'Tag deleted successfully' });
        } else {
          return Response.json(
            { success: false, error: 'Failed to delete tag' },
            { status: 500 }
          );
        }
      } catch (error) {
        console.error(`Failed to delete tag ${tagName}:`, error);
        return Response.json(
          { success: false, error: 'Failed to delete tag' },
          { status: 500 }
        );
      }
    },

    /**
     * 批量删除
     */
    async batchDelete(request: BatchDeleteRequest) {
      try {
        let result;
        
        if (request.type === 'releases') {
          const releaseIds = request.items.map(Number);
          result = await githubService.deleteMultipleReleases(releaseIds);
        } else if (request.type === 'tags') {
          result = await githubService.deleteMultipleTags(request.items);
        } else if (request.type === 'both') {
          // 获取所有releases和tags，然后删除
          const [releases, tags] = await Promise.all([
            githubService.getReleases(),
            githubService.getTags()
          ]);
          
          const [releaseResult, tagResult] = await Promise.all([
            githubService.deleteMultipleReleases(releases.map(r => r.id)),
            githubService.deleteMultipleTags(tags.map(t => t.name))
          ]);
          
          result = {
            success: releaseResult.success || tagResult.success,
            message: `Releases: ${releaseResult.message}, Tags: ${tagResult.message}`,
            deleted_count: (releaseResult.deleted_count || 0) + (tagResult.deleted_count || 0)
          };
        } else {
          return Response.json(
            { success: false, error: 'Invalid delete type' },
            { status: 400 }
          );
        }

        return Response.json({ success: true, data: result });
      } catch (error) {
        console.error('Failed to batch delete:', error);
        return Response.json(
          { success: false, error: 'Failed to batch delete' },
          { status: 500 }
        );
      }
    }
  };
}
