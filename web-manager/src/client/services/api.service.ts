import type {
  BatchDeleteRequest,
  DeleteResponse,
  GitHubCommit,
  GitHubRelease,
  GitHubTag,
  RepositoryInfo,
} from "../../shared/types";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = (await response.json()) as ApiResponse<T>;
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Repository API
  async getRepository(): Promise<ApiResponse<RepositoryInfo>> {
    return this.request<RepositoryInfo>("/repository");
  }

  // Releases API
  async getReleases(): Promise<ApiResponse<GitHubRelease[]>> {
    return this.request<GitHubRelease[]>("/releases");
  }

  async deleteRelease(releaseId: number): Promise<ApiResponse<DeleteResponse>> {
    return this.request<DeleteResponse>(`/releases/${releaseId}`, {
      method: "DELETE",
    });
  }

  // Tags API
  async getTags(): Promise<ApiResponse<GitHubTag[]>> {
    return this.request<GitHubTag[]>("/tags");
  }

  async deleteTag(tagName: string): Promise<ApiResponse<DeleteResponse>> {
    return this.request<DeleteResponse>(
      `/tags/${encodeURIComponent(tagName)}`,
      {
        method: "DELETE",
      }
    );
  }

  // Commits API
  async getCommit(sha: string): Promise<ApiResponse<GitHubCommit>> {
    return this.request<GitHubCommit>(`/commits/${sha}`);
  }

  // Batch operations
  async batchDelete(
    request: BatchDeleteRequest
  ): Promise<ApiResponse<DeleteResponse>> {
    return this.request<DeleteResponse>("/releases/batch", {
      method: "DELETE",
      body: JSON.stringify(request),
    });
  }
}

export const apiClient = new ApiClient();
