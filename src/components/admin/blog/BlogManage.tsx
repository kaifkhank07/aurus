"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useContentStore } from "@/store/useContentStore";
import { Card, Btn, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import BlogHeader from "./BlogHeader";
import CreateBlog from "./CreateBlog";
import EditBlog from "./EditBlog";
import BlogDetails from "./BlogDetails";
import DeleteBlog from "./DeleteBlog";
import { SafeBlog, BlogQueryParams } from "@/types/blog.types";
import { getMediaUrl } from "@/lib/media";

const PAGE_LIMIT = 10;

export default function BlogManage() {
  const {
    blogs,
    blogsPagination,
    isLoadingBlogs,
    blogsError,
    fetchBlogs,
  } = useContentStore();

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<SafeBlog | null>(null);
  const [selectedBlogForDetails, setSelectedBlogForDetails] = useState<SafeBlog | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<SafeBlog | null>(null);

  // Search & Sorting state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "title" | "updatedAt">("createdAt");
  const [sortOrderDir, setSortOrderDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Quick feedback toast
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [copiedSlugId, setCopiedSlugId] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Auto-dismiss feedback
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setFeedback(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const loadBlogData = useCallback(
    async (force = false) => {
      const params: Partial<BlogQueryParams> = {
        page: currentPage,
        limit: PAGE_LIMIT,
        sortBy,
        sortOrderDir,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      await fetchBlogs(params, force);
    },
    [currentPage, debouncedSearch, sortBy, sortOrderDir, fetchBlogs]
  );

  useEffect(() => {
    loadBlogData();
  }, [loadBlogData]);

  const handleCopySlug = (slug: string, id: string) => {
    navigator.clipboard.writeText(`/blog/${slug}`);
    setCopiedSlugId(id);
    setTimeout(() => {
      setCopiedSlugId(null);
    }, 2000);
  };

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSortBy("createdAt");
    setSortOrderDir("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      sortBy !== "createdAt" ||
      sortOrderDir !== "desc"
    );
  }, [search, sortBy, sortOrderDir]);

  const totalCount = blogsPagination?.total ?? blogs.length;
  const totalPages =
    blogsPagination?.totalPages ?? Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlogHeader
        title="Blog Posts & Articles"
        sub="Publish, edit, and organize Aurus Journal lifestyle stories, packing guides, and hostel advice."
        totalCount={totalCount}
        onRefresh={() => loadBlogData(true)}
        refreshing={isLoadingBlogs}
        onCreateOpen={() => setCreateOpen(true)}
      />

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 shadow-sm transition-all duration-300 animate-in slide-in-from-top-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-rose-50 border border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2 h-2 rounded-full ${
                feedback.type === "success" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <Icon name="x" size={13} />
          </button>
        </div>
      )}

      {/* Main Table Card */}
      <Card className="p-0 overflow-hidden">
        {/* Table Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon name="search" size={14} />
            </div>
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles by title or keyword…"
              className="pl-9 pr-9"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Clear search"
              >
                <Icon name="x" size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrderDir}`}
              onChange={(e) => {
                const [sb, sod] = e.target.value.split("-") as [
                  "createdAt" | "title" | "updatedAt",
                  "asc" | "desc"
                ];
                setSortBy(sb);
                setSortOrderDir(sod);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 transition cursor-pointer"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="title-asc">Title (A → Z)</option>
              <option value="title-desc">Title (Z → A)</option>
            </select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Reset all filters"
              >
                <Icon name="refresh" size={12} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Server Error Alert */}
        {blogsError && (
          <div className="p-4 bg-rose-50 border-b border-rose-100 text-rose-700 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{blogsError}</span>
            </div>
            {blogsError.toLowerCase().includes("auth") || blogsError.toLowerCase().includes("session") ? (
              <Link href="/admin/login">
                <Btn variant="brand" size="sm">
                  Log In
                </Btn>
              </Link>
            ) : (
              <Btn variant="danger" size="sm" onClick={() => loadBlogData(true)}>
                Retry
              </Btn>
            )}
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-20">Banner</th>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4 w-48">URL Slug</th>
                <th className="py-3 px-4 w-40">Tags</th>
                <th className="py-3 px-4 w-28">Published</th>
                <th className="py-3 px-4 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingBlogs && blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <span className="inline-block animate-spin text-orange-500">
                        <Icon name="refresh" size={20} />
                      </span>
                      <span className="text-xs font-medium">Loading articles…</span>
                    </div>
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                        <Icon name="fileText" size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No blog posts found</p>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilters
                          ? "No blog articles match your search filter."
                          : "Publish your first journal article, student guide, or lifestyle post."}
                      </p>
                      {hasActiveFilters ? (
                        <Btn variant="ghost" size="sm" onClick={handleResetFilters} className="mt-2">
                          Clear Filters
                        </Btn>
                      ) : (
                        <Btn
                          variant="brand"
                          size="sm"
                          onClick={() => setCreateOpen(true)}
                          className="mt-2"
                        >
                          <Icon name="plus" size={13} />
                          <span>Write First Article</span>
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => {
                  const publishedDateFormatted = blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  const imageUrl = getMediaUrl(blog.image?.url || blog.image?.publickey);

                  return (
                    <tr
                      key={blog.id}
                      className="hover:bg-slate-50/70 transition-colors group select-text"
                    >
                      {/* Banner Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-16 h-11 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <Icon name="fileText" size={16} className="text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Title & Subtitle */}
                      <td className="py-3 px-4 min-w-[200px]">
                        <button
                          type="button"
                          onClick={() => setSelectedBlogForDetails(blog)}
                          className="text-left font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1 cursor-pointer hover:underline"
                        >
                          {blog.title}
                        </button>
                        {blog.subtitle && (
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {blog.subtitle}
                          </div>
                        )}
                      </td>

                      {/* URL Slug */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-slate-700 text-[11px] truncate max-w-[140px]">
                            /{blog.slug}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopySlug(blog.slug, blog.id)}
                            title="Copy blog URL slug"
                            className="text-slate-400 hover:text-slate-700 p-1 rounded transition cursor-pointer"
                          >
                            {copiedSlugId === blog.id ? (
                              <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                            ) : (
                              <Icon name="copy" size={11} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Tags */}
                      <td className="py-3 px-4">
                        {blog.tags && blog.tags.length > 0 ? (
                          <div className="flex items-center gap-1 flex-wrap">
                            {blog.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200"
                              >
                                #{tag}
                              </span>
                            ))}
                            {blog.tags.length > 2 && (
                              <span className="text-[10px] text-slate-400 font-bold">
                                +{blog.tags.length - 2}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Published Date */}
                      <td className="py-3 px-4 text-slate-500 text-[11px] font-medium whitespace-nowrap">
                        {publishedDateFormatted}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* View Preview */}
                          <button
                            type="button"
                            onClick={() => setSelectedBlogForDetails(blog)}
                            title="Preview article"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition cursor-pointer"
                          >
                            <Icon name="eye" size={13} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setEditingBlog(blog)}
                            title="Edit article"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
                          >
                            <Icon name="pen" size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeletingBlog(blog)}
                            title="Delete article"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
                          >
                            <Icon name="trash" size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalCount > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/40 text-xs text-slate-500">
            <div>
              Showing{" "}
              <strong className="text-slate-800 font-semibold">
                {Math.min(1 + (currentPage - 1) * PAGE_LIMIT, totalCount)}
              </strong>{" "}
              to{" "}
              <strong className="text-slate-800 font-semibold">
                {Math.min(currentPage * PAGE_LIMIT, totalCount)}
              </strong>{" "}
              of <strong className="text-slate-800 font-semibold">{totalCount}</strong> articles
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || isLoadingBlogs}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>

              <div className="px-3 py-1.5 font-bold text-slate-700 bg-slate-100 rounded-lg">
                {currentPage} / {totalPages}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || isLoadingBlogs}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      {createOpen && (
        <CreateBlog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Article published successfully to the Aurus Journal.",
            });
            loadBlogData(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingBlog && (
        <EditBlog
          key={editingBlog.id}
          open={!!editingBlog}
          blog={editingBlog}
          onClose={() => setEditingBlog(null)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Article updated successfully.",
            });
            loadBlogData(true);
          }}
        />
      )}

      {/* Details / Preview Modal */}
      {selectedBlogForDetails && (
        <BlogDetails
          open={!!selectedBlogForDetails}
          blog={selectedBlogForDetails}
          onClose={() => setSelectedBlogForDetails(null)}
          onEdit={() => {
            const b = selectedBlogForDetails;
            setSelectedBlogForDetails(null);
            setEditingBlog(b);
          }}
          onDelete={() => {
            const b = selectedBlogForDetails;
            setSelectedBlogForDetails(null);
            setDeletingBlog(b);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingBlog && (
        <DeleteBlog
          open={!!deletingBlog}
          blog={deletingBlog}
          onClose={() => setDeletingBlog(null)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Article deleted successfully.",
            });
            loadBlogData(true);
          }}
        />
      )}
    </div>
  );
}

