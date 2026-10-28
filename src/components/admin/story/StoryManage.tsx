"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useContentStore } from "@/store/useContentStore";
import { Card, Chip, Btn, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import StoryHeader from "./StoryHeader";
import CreateStory from "./CreateStory";
import EditStory from "./EditStory";
import StoryDetails from "./StoryDetails";
import DeleteStory from "./DeleteStory";
import { SafeStory, StoryQueryParams } from "@/types/story.types";
import { getMediaUrl } from "@/lib/media";

const PAGE_LIMIT = 10;
type StatusFilter = "all" | "active" | "inactive";
type FeaturedFilter = "all" | "featured" | "standard";

export default function StoryManage() {
  const {
    stories,
    storiesPagination,
    isLoadingStories,
    storiesError,
    fetchStories,
    updateStory,
  } = useContentStore();

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<SafeStory | null>(null);
  const [selectedStoryForDetails, setSelectedStoryForDetails] = useState<SafeStory | null>(null);
  const [deletingStory, setDeletingStory] = useState<SafeStory | null>(null);

  // Search & Filter & Sorting state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "rating" | "name">("createdAt");
  const [sortOrderDir, setSortOrderDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Status toggle in-flight
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Quick feedback toast
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

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

  const loadStoryData = useCallback(
    async (force = false) => {
      const params: Partial<StoryQueryParams> = {
        page: currentPage,
        limit: PAGE_LIMIT,
        sortBy,
        sortOrderDir,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (statusFilter === "active") {
        params.isActive = true;
      } else if (statusFilter === "inactive") {
        params.isActive = false;
      }

      if (featuredFilter === "featured") {
        params.isFeatured = true;
      } else if (featuredFilter === "standard") {
        params.isFeatured = false;
      }

      await fetchStories(params, force);
    },
    [currentPage, debouncedSearch, statusFilter, featuredFilter, sortBy, sortOrderDir, fetchStories]
  );

  useEffect(() => {
    loadStoryData();
  }, [loadStoryData]);

  const handleToggleStatus = async (item: SafeStory) => {
    setTogglingId(item.id);
    const nextStatus = !item.isActive;

    const res = await updateStory(item.id, { isActive: nextStatus });
    setTogglingId(null);

    if (res.success) {
      setFeedback({
        type: "success",
        message: `Story from "${item.name}" is now ${nextStatus ? "Active" : "Inactive"}.`,
      });
      loadStoryData(true);
    } else {
      setFeedback({
        type: "error",
        message: res.message || "Failed to update story status.",
      });
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setFeaturedFilter("all");
    setSortBy("createdAt");
    setSortOrderDir("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      statusFilter !== "all" ||
      featuredFilter !== "all" ||
      sortBy !== "createdAt" ||
      sortOrderDir !== "desc"
    );
  }, [search, statusFilter, featuredFilter, sortBy, sortOrderDir]);

  const totalCount = storiesPagination?.total ?? stories.length;
  const totalPages =
    storiesPagination?.totalPages ?? Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  return (
    <div className="space-y-6">
      {/* Header */}
      <StoryHeader
        title="Student & Resident Stories"
        sub="Manage resident reviews, star ratings, featured community stories, and testimonials."
        totalCount={totalCount}
        onRefresh={() => loadStoryData(true)}
        refreshing={isLoadingStories}
        onCreateOpen={() => setCreateOpen(true)}
      />

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 shadow-sm transition-all duration-300 animate-in slide-in-from-top-2 ${feedback.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
            : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2 h-2 rounded-full ${feedback.type === "success" ? "bg-emerald-500" : "bg-rose-500"
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
              placeholder="Search by resident, profession, or location…"
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
            {/* Status Tabs */}
            <div className="inline-flex rounded-xl bg-slate-200/60 p-1 text-xs font-semibold text-slate-600">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.value);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${statusFilter === tab.value
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "hover:text-slate-900 text-slate-600"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Featured Filter */}
            <select
              value={featuredFilter}
              onChange={(e) => {
                setFeaturedFilter(e.target.value as FeaturedFilter);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 transition cursor-pointer"
            >
              <option value="all">All Stories</option>
              <option value="featured">★ Featured Only</option>
              <option value="standard">Standard Only</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrderDir}`}
              onChange={(e) => {
                const [sb, sod] = e.target.value.split("-") as [
                  "createdAt" | "rating" | "name",
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
              <option value="rating-desc">Highest Rated</option>
              <option value="rating-asc">Lowest Rated</option>
              <option value="name-asc">Name (A → Z)</option>
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
        {storiesError && (
          <div className="p-4 bg-rose-50 border-b border-rose-100 text-rose-700 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{storiesError}</span>
            </div>
            {storiesError.toLowerCase().includes("auth") || storiesError.toLowerCase().includes("session") ? (
              <Link href="/admin/login">
                <Btn variant="brand" size="sm">
                  Log In
                </Btn>
              </Link>
            ) : (
              <Btn variant="danger" size="sm" onClick={() => loadStoryData(true)}>
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
                <th className="py-3 px-4">Resident</th>
                <th className="py-3 px-4 w-36">Rating & Location</th>
                <th className="py-3 px-4">Testimonial Excerpt</th>
                <th className="py-3 px-4 w-28">Featured</th>
                <th className="py-3 px-4 w-28">Status</th>
                <th className="py-3 px-4 w-28">Date</th>
                <th className="py-3 px-4 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingStories && stories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <span className="inline-block animate-spin text-amber-500">
                        <Icon name="refresh" size={20} />
                      </span>
                      <span className="text-xs font-medium">Loading resident stories…</span>
                    </div>
                  </td>
                </tr>
              ) : stories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                        <Icon name="star" size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No resident stories found</p>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilters
                          ? "No resident stories match your search criteria."
                          : "Add resident testimonials and community stories to showcase on the Aurus website."}
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
                          <span>Add First Story</span>
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                stories.map((story) => {
                  const createdDateFormatted = story.createdAt
                    ? new Date(story.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    : "—";

                  const imageUrl = getMediaUrl(story.image?.url || story.image?.publickey);

                  const isTogglingThis = togglingId === story.id;

                  return (
                    <tr
                      key={story.id}
                      className="hover:bg-slate-50/70 transition-colors group select-text"
                    >
                      {/* Resident Initial & Profession */}
                      <td className="py-3 px-4 min-w-[190px]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {story.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => setSelectedStoryForDetails(story)}
                              className="text-left font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate block max-w-[160px] cursor-pointer hover:underline"
                            >
                              {story.name}
                            </button>
                            <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                              {story.profession}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Rating & Location */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <span>★</span>
                          <span>{story.rating}.0</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium truncate max-w-[140px]">
                          <Icon name="pin" size={10} className="text-slate-400 shrink-0" />
                          <span className="truncate">{story.location}</span>
                        </div>
                      </td>

                      {/* Excerpt */}
                      <td className="py-3 px-4 max-w-[240px]">
                        <button
                          type="button"
                          onClick={() => setSelectedStoryForDetails(story)}
                          className="text-left text-slate-600 hover:text-slate-900 truncate block w-full cursor-pointer hover:underline text-xs italic"
                          title="Click to view full review"
                        >
                          &ldquo;{story.description}&rdquo;
                        </button>
                      </td>

                      {/* Featured Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {story.isFeatured ? (
                          <div className="flex items-center gap-1.5">
                            <Chip tone="amber">
                              ★ Featured
                            </Chip>
                            {/* {imageUrl && (
                              <span
                                title="Background / side card image attached"
                                className="text-amber-600 bg-amber-50 p-1 rounded-md border border-amber-200 flex items-center justify-center"
                              >
                                <Icon name="card" size={11} />
                              </span>
                            )} */}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      {/* Status */}
                      {/* <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(story)}
                          disabled={isTogglingThis}
                          title={story.isActive ? "Deactivate story" : "Activate story"}
                          className="cursor-pointer"
                        >
                          <Chip tone={story.isActive ? "mint" : "rose"} dot>
                            {story.isActive ? "Active" : "Inactive"}
                          </Chip>
                        </button>
                      </td> */}
                      <td className="py-3 px-4">
                        <Chip tone={story.isActive ? "mint" : "rose"} dot>
                          {story.isActive ? "Active" : "Inactive"}
                        </Chip>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 text-[11px] font-medium whitespace-nowrap">
                        {createdDateFormatted}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* Toggle status icon button */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(story)}
                            disabled={isTogglingThis}
                            title={story.isActive ? "Deactivate story" : "Activate story"}
                            className={`p-1.5 rounded-lg border transition cursor-pointer disabled:opacity-50 ${story.isActive
                              ? "border-slate-200 text-slate-600 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                          >
                            {isTogglingThis ? (
                              <span className="inline-block animate-spin">
                                <Icon name="refresh" size={13} />
                              </span>
                            ) : (
                              <Icon name={story.isActive ? "x" : "check"} size={13} />
                            )}
                          </button>

                          {/* View Preview */}
                          <button
                            type="button"
                            onClick={() => setSelectedStoryForDetails(story)}
                            title="Preview story"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition cursor-pointer"
                          >
                            <Icon name="eye" size={13} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setEditingStory(story)}
                            title="Edit story"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
                          >
                            <Icon name="pen" size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeletingStory(story)}
                            title="Delete story"
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
              of <strong className="text-slate-800 font-semibold">{totalCount}</strong> stories
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || isLoadingStories}
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
                disabled={currentPage >= totalPages || isLoadingStories}
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
        <CreateStory
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Resident story created successfully.",
            });
            loadStoryData(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingStory && (
        <EditStory
          key={editingStory.id}
          open={!!editingStory}
          story={editingStory}
          onClose={() => setEditingStory(null)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Resident story updated successfully.",
            });
            loadStoryData(true);
          }}
        />
      )}

      {/* Details Modal */}
      {selectedStoryForDetails && (
        <StoryDetails
          open={!!selectedStoryForDetails}
          story={selectedStoryForDetails}
          onClose={() => setSelectedStoryForDetails(null)}
          onEdit={() => {
            const s = selectedStoryForDetails;
            setSelectedStoryForDetails(null);
            setEditingStory(s);
          }}
          onDelete={() => {
            const s = selectedStoryForDetails;
            setSelectedStoryForDetails(null);
            setDeletingStory(s);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingStory && (
        <DeleteStory
          open={!!deletingStory}
          story={deletingStory}
          onClose={() => setDeletingStory(null)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Resident story deleted successfully.",
            });
            loadStoryData(true);
          }}
        />
      )}
    </div>
  );
}

