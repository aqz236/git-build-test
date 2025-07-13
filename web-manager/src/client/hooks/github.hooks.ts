import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BatchDeleteRequest } from "../../shared/types";
import { apiClient } from "../services/api.service";

// Query keys
export const queryKeys = {
  repository: ["repository"] as const,
  releases: ["releases"] as const,
  tags: ["tags"] as const,
  commit: (sha: string) => ["commit", sha] as const,
};

/**
 * 获取仓库信息
 */
export function useRepository() {
  return useQuery({
    queryKey: queryKeys.repository,
    queryFn: async () => {
      const response = await apiClient.getRepository();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch repository");
      }
      return response.data!;
    },
  });
}

/**
 * 获取所有 releases
 */
export function useReleases() {
  return useQuery({
    queryKey: queryKeys.releases,
    queryFn: async () => {
      const response = await apiClient.getReleases();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch releases");
      }
      return response.data!;
    },
  });
}

/**
 * 获取所有 tags
 */
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: async () => {
      const response = await apiClient.getTags();
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch tags");
      }
      return response.data!;
    },
  });
}

/**
 * 获取提交信息
 */
export function useCommit(sha: string) {
  return useQuery({
    queryKey: queryKeys.commit(sha),
    queryFn: async () => {
      const response = await apiClient.getCommit(sha);
      if (!response.success) {
        throw new Error(response.error || "Failed to fetch commit");
      }
      return response.data!;
    },
    enabled: !!sha,
  });
}

/**
 * 删除单个 release
 */
export function useDeleteRelease() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (releaseId: number) => {
      const response = await apiClient.deleteRelease(releaseId);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete release");
      }
      return response.data!;
    },
    onSuccess: () => {
      // 刷新 releases 列表
      queryClient.invalidateQueries({ queryKey: queryKeys.releases });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}

/**
 * 删除单个 tag
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagName: string) => {
      const response = await apiClient.deleteTag(tagName);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete tag");
      }
      return response.data!;
    },
    onSuccess: () => {
      // 刷新 tags 列表
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}

/**
 * 批量删除
 */
export function useBatchDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: BatchDeleteRequest) => {
      const response = await apiClient.batchDelete(request);
      if (!response.success) {
        throw new Error(response.error || "Failed to batch delete");
      }
      return response.data!;
    },
    onSuccess: () => {
      // 刷新所有列表
      queryClient.invalidateQueries({ queryKey: queryKeys.releases });
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
}
