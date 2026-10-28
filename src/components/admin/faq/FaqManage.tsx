"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useContentStore } from "@/store/useContentStore";
import { Card, Chip, Btn, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import FaqHeader from "./FaqHeader";
import CreateFaq from "./CreateFaq";
import EditFaq from "./EditFaq";
import BulkEditFaq from "./BulkEditFaq";
import FaqDetails, { CATEGORY_COLORS } from "./FaqDetails";
import DeleteFaq from "./DeleteFaq";
import {
  SafeFaq,
  FaqQueryParams,
  FAQ_CATEGORIES,
  FAQ_CATEGORY_LABELS,
  FaqCategory,
} from "@/types/faq.types";

const PAGE_LIMIT = 15;

export default function FaqManage() {
  const {
    faqs,
    faqsPagination,
    isLoadingFaqs,
    faqsError,
    fetchFaqs,
    updateFaq,
  } = useContentStore();

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<SafeFaq | null>(null);
  const [detailsFaq, setDetailsFaq] = useState<SafeFaq | null>(null);
  const [deletingFaq, setDeletingFaq] = useState<SafeFaq | null>(null);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [sortBy, setSortBy] = useState<"sortOrder" | "createdAt" | "question" | "category">("sortOrder");
  const [sortOrderDir, setSortOrderDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Selection state for multiple updates / deletes
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Individual toggle loading state
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

  // Fetch FAQ data
  const loadFaqData = useCallback(
    async (force = false) => {
      const params: Partial<FaqQueryParams> = {
        page: currentPage,
        limit: PAGE_LIMIT,
        sortBy,
        sortOrderDir,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      if (statusFilter === "active") {
        params.isActive = true;
      } else if (statusFilter === "inactive") {
        params.isActive = false;
      }

      await fetchFaqs(params, force);
    },
    [
      currentPage,
      debouncedSearch,
      selectedCategory,
      statusFilter,
      sortBy,
      sortOrderDir,
      fetchFaqs,
    ]
  );

  useEffect(() => {
    loadFaqData();
  }, [loadFaqData]);

  // Reset filters
  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCategory("all");
    setStatusFilter("all");
    setSortBy("sortOrder");
    setSortOrderDir("asc");
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const hasActiveFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      selectedCategory !== "all" ||
      statusFilter !== "all" ||
      sortBy !== "sortOrder" ||
      sortOrderDir !== "asc"
    );
  }, [search, selectedCategory, statusFilter, sortBy, sortOrderDir]);

  // Toggle single FAQ active status
  const handleToggleStatus = async (item: SafeFaq) => {
    setTogglingId(item.id);
    const nextStatus = !item.isActive;
    const res = await updateFaq(item.id, { isActive: nextStatus });
    setTogglingId(null);

    if (res.success) {
      setFeedback({
        type: "success",
        message: `FAQ marked as ${nextStatus ? "active" : "inactive"}.`,
      });
    } else {
      setFeedback({
        type: "error",
        message: res.message || "Failed to update FAQ status.",
      });
    }
  };

  // Selection handlers
  const handleSelectAllOnPage = () => {
    if (selectedIds.size === faqs.length && faqs.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(faqs.map((f) => f.id)));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedFaqsList = useMemo(() => {
    return faqs.filter((f) => selectedIds.has(f.id));
  }, [faqs, selectedIds]);

  const totalPages = faqsPagination?.totalPages || 1;
  const totalCount = faqsPagination?.total ?? faqs.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <FaqHeader
        totalCount={totalCount}
        onRefresh={() => loadFaqData(true)}
        refreshing={isLoadingFaqs}
        onCreateOpen={() => setCreateOpen(true)}
        selectedCount={selectedIds.size}
        onBulkEditOpen={() => setBulkEditOpen(true)}
        onBulkDeleteOpen={() => setBulkDeleteOpen(true)}
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
              placeholder="Search by question, keyword, or answer…"
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
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 transition cursor-pointer"
            >
              <option value="all">All Categories</option>
              {FAQ_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {FAQ_CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>

            {/* Status Filter */}
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
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${statusFilter === tab.value
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "hover:text-slate-900 text-slate-600"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrderDir}`}
              onChange={(e) => {
                const [sb, sod] = e.target.value.split("-") as [
                  "sortOrder" | "createdAt" | "question" | "category",
                  "asc" | "desc"
                ];
                setSortBy(sb);
                setSortOrderDir(sod);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 transition cursor-pointer"
            >
              <option value="sortOrder-asc">Order (Low to High)</option>
              <option value="sortOrder-desc">Order (High to Low)</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="question-asc">Question (A → Z)</option>
              <option value="category-asc">Category (A → Z)</option>
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
        {faqsError && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <Icon name="info" size={14} className="shrink-0 text-rose-500" />
            <span>{faqsError}</span>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      faqs.length > 0 && selectedIds.size === faqs.length
                    }
                    onChange={handleSelectAllOnPage}
                    className="w-4 h-4 rounded text-orange-600 border-slate-300 focus:ring-orange-500 cursor-pointer"
                    title="Select all on this page"
                  />
                </th>
                <th className="py-3 px-3 w-16 text-center">Order</th>
                <th className="py-3 px-4 w-44">Category</th>
                <th className="py-3 px-4 min-w-[280px]">Question & Answer</th>
                <th className="py-3 px-4 w-28 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-right w-36 whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-sans">
              {isLoadingFaqs ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin inline-block" />
                      <span className="text-xs font-semibold">Loading FAQs…</span>
                    </div>
                  </td>
                </tr>
              ) : faqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="max-w-sm mx-auto flex flex-col items-center justify-center gap-2">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Icon name="info" size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        No FAQs Found
                      </h4>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilters
                          ? "No FAQs match your current search and filters."
                          : "Start building your knowledge base by creating your first FAQ or adding a batch for a category."}
                      </p>
                      {hasActiveFilters ? (
                        <Btn
                          variant="ghost"
                          size="sm"
                          onClick={handleResetFilters}
                          className="mt-2"
                        >
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
                          <span>Add First FAQ</span>
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => {
                  const isSelected = selectedIds.has(faq.id);
                  const isTogglingThis = togglingId === faq.id;
                  const categoryStyle =
                    CATEGORY_COLORS[faq.category] || {
                      bg: "bg-slate-50",
                      text: "text-slate-700",
                      border: "border-slate-200",
                      dot: "bg-slate-400",
                    };
                  const categoryLabel =
                    FAQ_CATEGORY_LABELS[faq.category] || faq.category;

                  return (
                    <tr
                      key={faq.id}
                      className={`hover:bg-slate-50/70 transition-colors group select-text ${isSelected ? "bg-orange-50/30" : ""
                        }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelectRow(faq.id)}
                          className="w-4 h-4 rounded text-orange-600 border-slate-300 focus:ring-orange-500 cursor-pointer"
                        />
                      </td>

                      {/* Sort Order Badge */}
                      <td className="py-3 px-3 text-center">
                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          #{faq.sortOrder}
                        </span>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`}
                          />
                          <span className="truncate max-w-[130px]">
                            {categoryLabel}
                          </span>
                        </span>
                      </td>

                      {/* Question & Answer Preview */}
                      <td className="py-3 px-4 min-w-[280px]">
                        <button
                          type="button"
                          onClick={() => setDetailsFaq(faq)}
                          className="text-left font-bold text-slate-900 group-hover:text-orange-600 transition-colors block cursor-pointer hover:underline text-xs line-clamp-1"
                        >
                          {faq.question}
                        </button>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {faq.answer}
                        </p>
                      </td>

                      {/* Status */}
                      {/* <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(faq)}
                          disabled={isTogglingThis}
                          title={faq.isActive ? "Deactivate FAQ" : "Activate FAQ"}
                          className="cursor-pointer"
                        >
                          <Chip tone={faq.isActive ? "mint" : "rose"} dot>
                            {faq.isActive ? "Active" : "Inactive"}
                          </Chip>
                        </button>
                      </td> */}
                      <td className="py-3 px-4">
                        <Chip tone={faq.isActive ? "mint" : "rose"} dot>
                          {faq.isActive ? "Active" : "Inactive"}
                        </Chip>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* Quick Toggle Status */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(faq)}
                            disabled={isTogglingThis}
                            title={faq.isActive ? "Deactivate FAQ" : "Activate FAQ"}
                            className={`p-1.5 rounded-lg border transition cursor-pointer disabled:opacity-50 ${faq.isActive
                              ? "border-slate-200 text-slate-600 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                          >
                            {isTogglingThis ? (
                              <span className="inline-block animate-spin">
                                <Icon name="refresh" size={13} />
                              </span>
                            ) : (
                              <Icon name={faq.isActive ? "x" : "check"} size={13} />
                            )}
                          </button>

                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setDetailsFaq(faq)}
                            title="View full FAQ"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition cursor-pointer"
                          >
                            <Icon name="eye" size={13} />
                          </button>

                          {/* Edit FAQ */}
                          <button
                            type="button"
                            onClick={() => setEditingFaq(faq)}
                            title="Edit FAQ"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
                          >
                            <Icon name="pen" size={13} />
                          </button>

                          {/* Delete FAQ */}
                          <button
                            type="button"
                            onClick={() => setDeletingFaq(faq)}
                            title="Delete FAQ"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
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
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {(currentPage - 1) * PAGE_LIMIT + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * PAGE_LIMIT, totalCount)}
              </span>{" "}
              of <span className="font-semibold text-slate-700">{totalCount}</span> FAQs
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || isLoadingFaqs}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1
                  );
                })
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;

                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && (
                        <span className="px-1 text-slate-400">…</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(p)}
                        className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition cursor-pointer ${currentPage === p
                          ? "bg-orange-500 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100"
                          }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || isLoadingFaqs}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Dialogs */}

      {/* 1. Create Modal (Single or Multiple for Category) */}
      <CreateFaq
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultCategory={selectedCategory !== "all" ? (selectedCategory as FaqCategory) : "general"}
        onSuccess={() => {
          setFeedback({
            type: "success",
            message: "FAQ(s) created successfully.",
          });
          loadFaqData(true);
        }}
      />

      {/* 2. Edit Modal */}
      {editingFaq && (
        <EditFaq
          key={editingFaq.id}
          open={Boolean(editingFaq)}
          faq={editingFaq}
          onClose={() => setEditingFaq(null)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "FAQ updated successfully.",
            });
            loadFaqData(true);
          }}
        />
      )}

      {/* 3. Bulk Edit Modal */}
      {bulkEditOpen && (
        <BulkEditFaq
          key={Array.from(selectedIds).sort().join(",")}
          open={bulkEditOpen}
          selectedFaqs={selectedFaqsList}
          onClose={() => setBulkEditOpen(false)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: `Successfully updated ${selectedIds.size} FAQs.`,
            });
            setSelectedIds(new Set());
            loadFaqData(true);
          }}
        />
      )}

      {/* 4. Delete Modal (Single or Bulk) */}
      <DeleteFaq
        open={Boolean(deletingFaq) || bulkDeleteOpen}
        faq={deletingFaq}
        bulkIds={bulkDeleteOpen ? Array.from(selectedIds) : undefined}
        onClose={() => {
          setDeletingFaq(null);
          setBulkDeleteOpen(false);
        }}
        onSuccess={() => {
          setFeedback({
            type: "success",
            message: deletingFaq
              ? "FAQ deleted successfully."
              : `Successfully deleted ${selectedIds.size} FAQs.`,
          });
          setSelectedIds(new Set());
          loadFaqData(true);
        }}
      />

      {/* 5. Details Modal */}
      <FaqDetails
        open={Boolean(detailsFaq)}
        faq={detailsFaq}
        onClose={() => setDetailsFaq(null)}
        onEdit={(faq) => setEditingFaq(faq)}
      />
    </div>
  );
}
