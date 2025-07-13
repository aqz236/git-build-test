import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  bulkDeleteReleases,
  bulkDeleteTags,
  getReleases,
  getTags,
  searchReleases,
  searchTags,
  type GitHubRelease,
  type GitHubTag,
} from "../services/github-api";

export interface GitHubState {
  // Releases 数据
  releases: GitHubRelease[];
  releasesCache: Map<
    string,
    { data: GitHubRelease[]; hasNextPage: boolean; timestamp: number }
  >;
  releasesLoading: boolean;
  releasesError: string | null;
  releasesPage: number;
  releasesHasNextPage: boolean;

  // Tags 数据
  tags: GitHubTag[];
  tagsCache: Map<
    string,
    { data: GitHubTag[]; hasNextPage: boolean; timestamp: number }
  >;
  tagsLoading: boolean;
  tagsError: string | null;
  tagsPage: number;
  tagsHasNextPage: boolean;

  // 搜索状态
  searchKeyword: string;
  debouncedSearchKeyword: string;
  isSearching: boolean;

  // UI 状态
  activeTab: "releases" | "tags";
  selectedIds: Set<number | string>;

  // Actions
  setActiveTab: (tab: "releases" | "tags") => void;
  setSearchKeyword: (keyword: string) => void;
  setDebouncedSearchKeyword: (keyword: string) => void;
  setIsSearching: (searching: boolean) => void;

  // Selection actions
  toggleSelection: (id: number | string) => void;
  toggleSelectAll: (items: GitHubRelease[] | GitHubTag[]) => void;
  clearSelection: () => void;

  // Data actions
  fetchReleases: (page?: number, keyword?: string) => Promise<void>;
  fetchTags: (page?: number, keyword?: string) => Promise<void>;
  deleteSelectedReleases: () => Promise<void>;
  deleteSelectedTags: () => Promise<void>;

  // Cache management
  clearCache: () => void;
  getCachedData: (
    type: "releases" | "tags",
    key: string
  ) => { data: any[]; hasNextPage: boolean } | null;

  // Force refresh without cache
  forceRefreshReleases: () => Promise<void>;
  forceRefreshTags: () => Promise<void>;
}

const CACHE_DURATION = 2 * 60 * 1000; // 2分钟缓存，减少缓存时间

export const useGitHubStore = create<GitHubState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    releases: [],
    releasesCache: new Map(),
    releasesLoading: false,
    releasesError: null,
    releasesPage: 1,
    releasesHasNextPage: false,

    tags: [],
    tagsCache: new Map(),
    tagsLoading: false,
    tagsError: null,
    tagsPage: 1,
    tagsHasNextPage: false,

    searchKeyword: "",
    debouncedSearchKeyword: "",
    isSearching: false,

    activeTab: "releases",
    selectedIds: new Set(),

    // UI Actions
    setActiveTab: (tab) => set({ activeTab: tab, selectedIds: new Set() }),

    setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

    setDebouncedSearchKeyword: (keyword) => {
      set({ debouncedSearchKeyword: keyword });
      const { activeTab } = get();
      if (activeTab === "releases") {
        get().fetchReleases(1, keyword);
      } else {
        get().fetchTags(1, keyword);
      }
    },

    setIsSearching: (searching) => set({ isSearching: searching }),

    // Selection actions
    toggleSelection: (id) => {
      const { selectedIds } = get();
      const newSelection = new Set(selectedIds);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      set({ selectedIds: newSelection });
    },

    toggleSelectAll: (items) => {
      const { selectedIds } = get();
      const allIds = items.map((item) => ("id" in item ? item.id : item.name));
      const allSelected = allIds.every((id) => selectedIds.has(id));

      if (allSelected) {
        set({ selectedIds: new Set() });
      } else {
        set({ selectedIds: new Set([...selectedIds, ...allIds]) });
      }
    },

    clearSelection: () => set({ selectedIds: new Set() }),

    // Cache management
    getCachedData: (type, key) => {
      const cache = type === "releases" ? get().releasesCache : get().tagsCache;
      const cached = cache.get(key);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return { data: cached.data, hasNextPage: cached.hasNextPage };
      }
      return null;
    },

    clearCache: () => {
      set({
        releasesCache: new Map(),
        tagsCache: new Map(),
      });
    },

    // Force refresh without cache
    forceRefreshReleases: async () => {
      // 清除releases缓存
      set({ releasesCache: new Map() });
      // 重新获取数据
      await get().fetchReleases(
        get().releasesPage,
        get().debouncedSearchKeyword
      );
    },

    forceRefreshTags: async () => {
      // 清除tags缓存
      set({ tagsCache: new Map() });
      // 重新获取数据
      await get().fetchTags(get().tagsPage, get().debouncedSearchKeyword);
    },

    // Data fetching
    fetchReleases: async (page = 1, keyword = "") => {
      const cacheKey = `${page}-${keyword}`;
      const cached = get().getCachedData("releases", cacheKey);

      if (cached) {
        set({
          releases: cached.data,
          releasesHasNextPage: cached.hasNextPage,
          releasesPage: page,
          releasesLoading: false,
        });
        return;
      }

      set({ releasesLoading: true, releasesError: null });

      try {
        const result = keyword.trim()
          ? await searchReleases(keyword, page, 10)
          : await getReleases(page, 10);

        // Update cache
        const { releasesCache } = get();
        releasesCache.set(cacheKey, {
          data: result.data,
          hasNextPage: result.hasNextPage,
          timestamp: Date.now(),
        });

        set({
          releases: result.data,
          releasesHasNextPage: result.hasNextPage,
          releasesPage: page,
          releasesLoading: false,
          releasesCache,
        });
      } catch (error) {
        set({
          releasesError:
            error instanceof Error ? error.message : "Unknown error",
          releasesLoading: false,
        });
      }
    },

    fetchTags: async (page = 1, keyword = "") => {
      const cacheKey = `${page}-${keyword}`;
      const cached = get().getCachedData("tags", cacheKey);

      if (cached) {
        set({
          tags: cached.data,
          tagsHasNextPage: cached.hasNextPage,
          tagsPage: page,
          tagsLoading: false,
        });
        return;
      }

      set({ tagsLoading: true, tagsError: null });

      try {
        const result = keyword.trim()
          ? await searchTags(keyword, page, 10)
          : await getTags(page, 10);

        // Update cache
        const { tagsCache } = get();
        tagsCache.set(cacheKey, {
          data: result.data,
          hasNextPage: result.hasNextPage,
          timestamp: Date.now(),
        });

        set({
          tags: result.data,
          tagsHasNextPage: result.hasNextPage,
          tagsPage: page,
          tagsLoading: false,
          tagsCache,
        });
      } catch (error) {
        set({
          tagsError: error instanceof Error ? error.message : "Unknown error",
          tagsLoading: false,
        });
      }
    },

    deleteSelectedReleases: async () => {
      const { selectedIds, releases } = get();
      const releaseIds = Array.from(selectedIds).filter(
        (id) => typeof id === "number"
      ) as number[];

      if (releaseIds.length === 0) return;

      set({ releasesLoading: true });

      try {
        await bulkDeleteReleases(releaseIds);

        // 清除选择
        set({ selectedIds: new Set() });

        // 强制刷新数据，绕过缓存
        await get().forceRefreshReleases();
      } catch (error) {
        set({
          releasesError:
            error instanceof Error ? error.message : "Delete failed",
          releasesLoading: false,
        });
      }
    },

    deleteSelectedTags: async () => {
      const { selectedIds, tags } = get();
      const tagNames = Array.from(selectedIds).filter(
        (id) => typeof id === "string"
      ) as string[];

      if (tagNames.length === 0) return;

      set({ tagsLoading: true });

      try {
        await bulkDeleteTags(tagNames);

        // 清除选择
        set({ selectedIds: new Set() });

        // 强制刷新数据，绕过缓存
        await get().forceRefreshTags();
      } catch (error) {
        set({
          tagsError: error instanceof Error ? error.message : "Delete failed",
          tagsLoading: false,
        });
      }
    },
  }))
);
