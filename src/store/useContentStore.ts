import { create } from "zustand";
import axios from "axios";
import { adminApiClient } from "@/lib/admin-api";
import { ApiResponse, PaginationMeta } from "@/types/general.types";
import {
  SafeBlog,
  CreateBlogInput,
  UpdateBlogInput,
  BlogQueryParams,
  PaginatedBlogsResult,
} from "@/types/blog.types";
import {
  SafeStory,
  CreateStoryInput,
  UpdateStoryInput,
  StoryQueryParams,
  PaginatedStoriesResult,
} from "@/types/story.types";
import {
  SafeFaq,
  CreateFaqPayload,
  UpdateFaqInput,
  BulkUpdateFaqItem,
  FaqQueryParams,
  PaginatedFaqsResult,
} from "@/types/faq.types";

/**
 * Standardized error extractor across all content operations.
 */
function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as { message?: string; errors?: unknown };
    if (data.message) {
      if (data.errors && typeof data.errors === "object") {
        if (Array.isArray(data.errors)) {
          const list = data.errors
            .map((e) => (typeof e === "string" ? e : e?.message || JSON.stringify(e)))
            .filter(Boolean);
          if (list.length > 0) return `${data.message} (${list.join(", ")})`;
        } else {
          const entries = Object.entries(data.errors as Record<string, string>);
          if (entries.length > 0) {
            const list = entries.map(([field, msg]) => `${field}: ${msg}`);
            return `${data.message} (${list.join("; ")})`;
          }
        }
      }
      return data.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export interface ContentState {
  // ── Blog Module State ──
  blogs: SafeBlog[];
  blogsPagination: PaginationMeta | null;
  isLoadingBlogs: boolean;
  blogsError: string | null;

  // ── Story Module State ──
  stories: SafeStory[];
  storiesPagination: PaginationMeta | null;
  isLoadingStories: boolean;
  storiesError: string | null;

  // ── FAQ Module State ──
  faqs: SafeFaq[];
  faqsPagination: PaginationMeta | null;
  isLoadingFaqs: boolean;
  faqsError: string | null;

  // ── Global Mutation State ──
  isMutating: boolean;
  error: string | null;

  // ── General Actions ──
  clearErrors: () => void;

  // ── Blog Actions ──
  fetchBlogs: (
    params?: Partial<BlogQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PaginatedBlogsResult; message?: string }>;
  getBlogById: (
    id: string
  ) => Promise<{ success: boolean; data?: SafeBlog; message?: string }>;
  createBlog: (
    input: CreateBlogInput | FormData
  ) => Promise<{ success: boolean; data?: SafeBlog; message?: string }>;
  updateBlog: (
    id: string,
    input: UpdateBlogInput | FormData
  ) => Promise<{ success: boolean; data?: SafeBlog; message?: string }>;
  deleteBlog: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // ── Story Actions ──
  fetchStories: (
    params?: Partial<StoryQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PaginatedStoriesResult; message?: string }>;
  getStoryById: (
    id: string
  ) => Promise<{ success: boolean; data?: SafeStory; message?: string }>;
  createStory: (
    input: CreateStoryInput | FormData
  ) => Promise<{ success: boolean; data?: SafeStory; message?: string }>;
  updateStory: (
    id: string,
    input: UpdateStoryInput | FormData
  ) => Promise<{ success: boolean; data?: SafeStory; message?: string }>;
  deleteStory: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;

  // ── FAQ Actions ──
  fetchFaqs: (
    params?: Partial<FaqQueryParams>,
    force?: boolean
  ) => Promise<{ success: boolean; data?: PaginatedFaqsResult; message?: string }>;
  getFaqById: (
    id: string
  ) => Promise<{ success: boolean; data?: SafeFaq; message?: string }>;
  createFaq: (
    input: CreateFaqPayload
  ) => Promise<{ success: boolean; data?: SafeFaq | SafeFaq[]; message?: string; count?: number }>;
  updateFaq: (
    id: string,
    input: UpdateFaqInput
  ) => Promise<{ success: boolean; data?: SafeFaq; message?: string }>;
  bulkUpdateFaqs: (
    faqs: BulkUpdateFaqItem[]
  ) => Promise<{ success: boolean; data?: SafeFaq[]; message?: string; count?: number }>;
  deleteFaq: (
    id: string
  ) => Promise<{ success: boolean; message?: string }>;
  bulkDeleteFaqs: (
    ids: string[]
  ) => Promise<{ success: boolean; message?: string; count?: number }>;
}

// In-flight request caching to prevent duplicate API calls
const inFlightRequests = new Map<string, Promise<unknown>>();

function getInFlight<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const existing = inFlightRequests.get(key);
  if (existing) {
    return existing as Promise<T>;
  }
  const promise = fn().finally(() => {
    inFlightRequests.delete(key);
  });
  inFlightRequests.set(key, promise);
  return promise;
}

export const useContentStore = create<ContentState>((set) => ({
  // Initial States
  blogs: [],
  blogsPagination: null,
  isLoadingBlogs: false,
  blogsError: null,

  stories: [],
  storiesPagination: null,
  isLoadingStories: false,
  storiesError: null,

  faqs: [],
  faqsPagination: null,
  isLoadingFaqs: false,
  faqsError: null,

  isMutating: false,
  error: null,

  clearErrors: () =>
    set({
      error: null,
      blogsError: null,
      storiesError: null,
      faqsError: null,
    }),

  // =========================================================================
  // 1. Blog Module
  // =========================================================================
  fetchBlogs: async (params = {}, force = false) => {
    const key = `blogs_${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PaginatedBlogsResult;
        message?: string;
      }>;
    }

    set({ isLoadingBlogs: true, blogsError: null });

    return getInFlight(key, async () => {
      try {
        const res = await adminApiClient.get<ApiResponse<PaginatedBlogsResult>>("/blogs", {
          params,
        });

        if (res.data.success && res.data.data) {
          set({
            blogs: res.data.data.items || [],
            blogsPagination: res.data.data.pagination || null,
            isLoadingBlogs: false,
            blogsError: null,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load blogs.";
        set({ isLoadingBlogs: false, blogsError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load blogs from server.");
        set({ isLoadingBlogs: false, blogsError: msg });
        return { success: false, message: msg };
      }
    });
  },

  getBlogById: async (id: string) => {
    try {
      const res = await adminApiClient.get<ApiResponse<{ blog: SafeBlog }>>(`/blogs/${id}`);
      if (res.data.success && res.data.data?.blog) {
        return { success: true, data: res.data.data.blog, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Blog not found." };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch blog details.");
      return { success: false, message: msg };
    }
  },

  createBlog: async (input) => {
    set({ isMutating: true, error: null, blogsError: null });
    try {
      const res = await adminApiClient.post<ApiResponse<{ blog: SafeBlog }>>(
        "/blogs",
        input
      );

      if (res.data.success && res.data.data?.blog) {
        const created = res.data.data.blog;
        set((state) => ({
          blogs: [created, ...state.blogs],
          blogsPagination: state.blogsPagination
            ? {
                ...state.blogsPagination,
                total: state.blogsPagination.total + 1,
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, data: created, message: res.data.message };
      }

      const msg = res.data.message || "Failed to create blog.";
      set({ isMutating: false, error: msg, blogsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create blog record.");
      set({ isMutating: false, error: msg, blogsError: msg });
      return { success: false, message: msg };
    }
  },

  updateBlog: async (id, input) => {
    set({ isMutating: true, error: null, blogsError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ blog: SafeBlog }>>(
        `/blogs/${id}`,
        input
      );

      if (res.data.success && res.data.data?.blog) {
        const updated = res.data.data.blog;
        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === id ? updated : b)),
          isMutating: false,
          error: null,
        }));
        return { success: true, data: updated, message: res.data.message };
      }

      const msg = res.data.message || "Failed to update blog.";
      set({ isMutating: false, error: msg, blogsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update blog record.");
      set({ isMutating: false, error: msg, blogsError: msg });
      return { success: false, message: msg };
    }
  },

  deleteBlog: async (id: string) => {
    set({ isMutating: true, error: null, blogsError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ message: string; id: string }>>(
        `/blogs/${id}`
      );

      if (res.data.success) {
        set((state) => ({
          blogs: state.blogs.filter((b) => b.id !== id),
          blogsPagination: state.blogsPagination
            ? {
                ...state.blogsPagination,
                total: Math.max(0, state.blogsPagination.total - 1),
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, message: res.data.message || "Blog deleted successfully." };
      }

      const msg = res.data.message || "Failed to delete blog.";
      set({ isMutating: false, error: msg, blogsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete blog record.");
      set({ isMutating: false, error: msg, blogsError: msg });
      return { success: false, message: msg };
    }
  },

  // =========================================================================
  // 2. Story Module
  // =========================================================================
  fetchStories: async (params = {}, force = false) => {
    const key = `stories_${JSON.stringify(params)}`;
    if (!force && inFlightRequests.has(key)) {
      return inFlightRequests.get(key) as Promise<{
        success: boolean;
        data?: PaginatedStoriesResult;
        message?: string;
      }>;
    }

    set({ isLoadingStories: true, storiesError: null });

    return getInFlight(key, async () => {
      try {
        const res = await adminApiClient.get<ApiResponse<PaginatedStoriesResult>>("/stories", {
          params,
        });

        if (res.data.success && res.data.data) {
          set({
            stories: res.data.data.items || [],
            storiesPagination: res.data.data.pagination || null,
            isLoadingStories: false,
            storiesError: null,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to load stories.";
        set({ isLoadingStories: false, storiesError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to load stories from server.");
        set({ isLoadingStories: false, storiesError: msg });
        return { success: false, message: msg };
      }
    });
  },

  getStoryById: async (id: string) => {
    try {
      const res = await adminApiClient.get<ApiResponse<{ story: SafeStory }>>(`/stories/${id}`);
      if (res.data.success && res.data.data?.story) {
        return { success: true, data: res.data.data.story, message: res.data.message };
      }
      return { success: false, message: res.data.message || "Story not found." };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch story details.");
      return { success: false, message: msg };
    }
  },

  createStory: async (input) => {
    set({ isMutating: true, error: null, storiesError: null });
    try {
      const res = await adminApiClient.post<ApiResponse<{ story: SafeStory }>>(
        "/stories",
        input
      );

      if (res.data.success && res.data.data?.story) {
        const created = res.data.data.story;
        set((state) => ({
          stories: [created, ...state.stories],
          storiesPagination: state.storiesPagination
            ? {
                ...state.storiesPagination,
                total: state.storiesPagination.total + 1,
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, data: created, message: res.data.message };
      }

      const msg = res.data.message || "Failed to create story.";
      set({ isMutating: false, error: msg, storiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create story record.");
      set({ isMutating: false, error: msg, storiesError: msg });
      return { success: false, message: msg };
    }
  },

  updateStory: async (id, input) => {
    set({ isMutating: true, error: null, storiesError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ story: SafeStory }>>(
        `/stories/${id}`,
        input
      );

      if (res.data.success && res.data.data?.story) {
        const updated = res.data.data.story;
        set((state) => ({
          stories: state.stories.map((s) => (s.id === id ? updated : s)),
          isMutating: false,
          error: null,
        }));
        return { success: true, data: updated, message: res.data.message };
      }

      const msg = res.data.message || "Failed to update story.";
      set({ isMutating: false, error: msg, storiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update story record.");
      set({ isMutating: false, error: msg, storiesError: msg });
      return { success: false, message: msg };
    }
  },

  deleteStory: async (id: string) => {
    set({ isMutating: true, error: null, storiesError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ message: string; id: string }>>(
        `/stories/${id}`
      );

      if (res.data.success) {
        set((state) => ({
          stories: state.stories.filter((s) => s.id !== id),
          storiesPagination: state.storiesPagination
            ? {
                ...state.storiesPagination,
                total: Math.max(0, state.storiesPagination.total - 1),
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, message: res.data.message || "Story deleted successfully." };
      }

      const msg = res.data.message || "Failed to delete story.";
      set({ isMutating: false, error: msg, storiesError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete story record.");
      set({ isMutating: false, error: msg, storiesError: msg });
      return { success: false, message: msg };
    }
  },

  // ──────────────────────────────────────────────
  // FAQ Module Implementations
  // ──────────────────────────────────────────────

  fetchFaqs: async (params = {}, force = false) => {
    const serializedKey = `faqs-${JSON.stringify(params)}`;

    if (!force) {
      const pending = inFlightRequests.get(serializedKey);
      if (pending) {
        return pending as Promise<{ success: boolean; data?: PaginatedFaqsResult; message?: string }>;
      }
    }

    set({ isLoadingFaqs: true, faqsError: null });

    const fetcher = async () => {
      try {
        const res = await adminApiClient.get<ApiResponse<PaginatedFaqsResult>>("/faqs", {
          params,
        });

        if (res.data.success && res.data.data) {
          set({
            faqs: res.data.data.items,
            faqsPagination: res.data.data.pagination,
            isLoadingFaqs: false,
            faqsError: null,
          });
          return { success: true, data: res.data.data, message: res.data.message };
        }

        const msg = res.data.message || "Failed to fetch FAQs.";
        set({ isLoadingFaqs: false, faqsError: msg });
        return { success: false, message: msg };
      } catch (err) {
        const msg = extractErrorMessage(err, "Failed to fetch FAQs.");
        set({ isLoadingFaqs: false, faqsError: msg });
        return { success: false, message: msg };
      }
    };

    return getInFlight(serializedKey, fetcher);
  },

  getFaqById: async (id: string) => {
    try {
      const res = await adminApiClient.get<ApiResponse<{ faq: SafeFaq }>>(`/faqs/${id}`);
      if (res.data.success && res.data.data?.faq) {
        return { success: true, data: res.data.data.faq };
      }
      return { success: false, message: res.data.message || "FAQ not found." };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to fetch FAQ details.");
      return { success: false, message: msg };
    }
  },

  createFaq: async (input: CreateFaqPayload) => {
    set({ isMutating: true, error: null, faqsError: null });
    try {
      const res = await adminApiClient.post<
        ApiResponse<{ faq?: SafeFaq; faqs?: SafeFaq[]; count?: number }>
      >("/faqs", input);

      if (res.data.success && res.data.data) {
        const createdFaq = res.data.data.faq;
        const createdFaqs = res.data.data.faqs;

        set((state) => {
          let updatedList = [...state.faqs];
          let addedCount = 0;

          if (createdFaq) {
            updatedList = [createdFaq, ...updatedList];
            addedCount = 1;
          } else if (Array.isArray(createdFaqs) && createdFaqs.length > 0) {
            updatedList = [...createdFaqs, ...updatedList];
            addedCount = createdFaqs.length;
          }

          return {
            faqs: updatedList,
            faqsPagination: state.faqsPagination
              ? {
                  ...state.faqsPagination,
                  total: state.faqsPagination.total + addedCount,
                }
              : null,
            isMutating: false,
            error: null,
          };
        });

        return {
          success: true,
          data: createdFaq || createdFaqs,
          count: res.data.data.count || (createdFaq ? 1 : createdFaqs?.length || 0),
          message: res.data.message || "FAQ(s) created successfully.",
        };
      }

      const msg = res.data.message || "Failed to create FAQ(s).";
      set({ isMutating: false, error: msg, faqsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to create FAQ record(s).");
      set({ isMutating: false, error: msg, faqsError: msg });
      return { success: false, message: msg };
    }
  },

  updateFaq: async (id: string, input: UpdateFaqInput) => {
    set({ isMutating: true, error: null, faqsError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ faq: SafeFaq }>>(
        `/faqs/${id}`,
        input
      );

      if (res.data.success && res.data.data?.faq) {
        const updated = res.data.data.faq;
        set((state) => ({
          faqs: state.faqs.map((f) => (f.id === id ? updated : f)),
          isMutating: false,
          error: null,
        }));
        return { success: true, data: updated, message: res.data.message };
      }

      const msg = res.data.message || "Failed to update FAQ.";
      set({ isMutating: false, error: msg, faqsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update FAQ record.");
      set({ isMutating: false, error: msg, faqsError: msg });
      return { success: false, message: msg };
    }
  },

  bulkUpdateFaqs: async (faqs: BulkUpdateFaqItem[]) => {
    set({ isMutating: true, error: null, faqsError: null });
    try {
      const res = await adminApiClient.patch<ApiResponse<{ faqs: SafeFaq[]; count?: number }>>(
        "/faqs/bulk",
        { faqs }
      );

      if (res.data.success && res.data.data?.faqs) {
        const updatedList = res.data.data.faqs;
        const updatedMap = new Map(updatedList.map((f) => [f.id, f]));

        set((state) => ({
          faqs: state.faqs.map((f) => updatedMap.get(f.id) || f),
          isMutating: false,
          error: null,
        }));

        return {
          success: true,
          data: updatedList,
          count: updatedList.length,
          message: res.data.message || "FAQs updated successfully.",
        };
      }

      const msg = res.data.message || "Failed to update FAQs.";
      set({ isMutating: false, error: msg, faqsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to update FAQ records.");
      set({ isMutating: false, error: msg, faqsError: msg });
      return { success: false, message: msg };
    }
  },

  deleteFaq: async (id: string) => {
    set({ isMutating: true, error: null, faqsError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ id: string }>>(
        `/faqs/${id}`
      );

      if (res.data.success) {
        set((state) => ({
          faqs: state.faqs.filter((f) => f.id !== id),
          faqsPagination: state.faqsPagination
            ? {
                ...state.faqsPagination,
                total: Math.max(0, state.faqsPagination.total - 1),
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return { success: true, message: res.data.message || "FAQ deleted successfully." };
      }

      const msg = res.data.message || "Failed to delete FAQ.";
      set({ isMutating: false, error: msg, faqsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete FAQ record.");
      set({ isMutating: false, error: msg, faqsError: msg });
      return { success: false, message: msg };
    }
  },

  bulkDeleteFaqs: async (ids: string[]) => {
    set({ isMutating: true, error: null, faqsError: null });
    try {
      const res = await adminApiClient.delete<ApiResponse<{ ids: string[]; deletedCount: number }>>(
        "/faqs/bulk",
        { data: { ids } }
      );

      if (res.data.success) {
        const deletedSet = new Set(ids);
        set((state) => ({
          faqs: state.faqs.filter((f) => !deletedSet.has(f.id)),
          faqsPagination: state.faqsPagination
            ? {
                ...state.faqsPagination,
                total: Math.max(0, state.faqsPagination.total - ids.length),
              }
            : null,
          isMutating: false,
          error: null,
        }));
        return {
          success: true,
          count: ids.length,
          message: res.data.message || "FAQs deleted successfully.",
        };
      }

      const msg = res.data.message || "Failed to delete FAQs.";
      set({ isMutating: false, error: msg, faqsError: msg });
      return { success: false, message: msg };
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to delete FAQ records.");
      set({ isMutating: false, error: msg, faqsError: msg });
      return { success: false, message: msg };
    }
  },
}));

export default useContentStore;

