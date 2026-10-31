"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useMasterStore } from "@/store/useMasterStore";
import { Card, Chip, Btn, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import RentFrequencyHeader from "./RentFrequencyHeader";
import CreateRentFrequency from "./CreateRentFrequency";
import EditRentFrequency from "./EditRentFrequency";
import DeleteRentFrequency from "./DeleteRentFrequency";
import { SafeRentFrequency, RentFrequencyQueryParams } from "@/types/rent-frequency.types";

const PAGE_LIMIT = 10;
type StatusFilter = "all" | "active" | "inactive";

export default function RentFrequencyManage() {
  const {
    rentFrequencies,
    rentFrequenciesPagination,
    isLoadingRentFrequencies,
    rentFrequenciesError,
    fetchRentFrequencies,
    updateRentFrequency,
  } = useMasterStore();

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editingFrequency, setEditingFrequency] = useState<SafeRentFrequency | null>(null);
  const [deletingFrequency, setDeletingFrequency] = useState<SafeRentFrequency | null>(null);

  // Search & Filter & Sorting state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "name">("name");
  const [sortOrderDir, setSortOrderDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Feedback notification
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [togglingId, setTogglingId] = useState<string | null>(null);

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

  const loadFrequencyData = useCallback(
    async (force = false) => {
      const params: Partial<RentFrequencyQueryParams> = {
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

      await fetchRentFrequencies(params, force);
    },
    [currentPage, debouncedSearch, statusFilter, sortBy, sortOrderDir, fetchRentFrequencies]
  );

  useEffect(() => {
    loadFrequencyData();
  }, [loadFrequencyData]);

  const handleToggleStatus = async (item: SafeRentFrequency) => {
    setTogglingId(item.id);
    const nextStatus = !item.isActive;

    const res = await updateRentFrequency(item.id, { isActive: nextStatus });
    setTogglingId(null);

    if (res.success) {
      setFeedback({
        type: "success",
        message: `Rent frequency "${item.name}" is now ${nextStatus ? "Active" : "Inactive"}.`,
      });
      loadFrequencyData(true);
    } else {
      setFeedback({
        type: "error",
        message: res.message || "Failed to update rent frequency status.",
      });
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setSortBy("name");
    setSortOrderDir("asc");
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      statusFilter !== "all" ||
      sortBy !== "name" ||
      sortOrderDir !== "asc"
    );
  }, [search, statusFilter, sortBy, sortOrderDir]);

  const totalCount = rentFrequenciesPagination?.total ?? rentFrequencies.length;
  const totalPages =
    rentFrequenciesPagination?.totalPages ?? Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  return (
    <div className="space-y-6">
      {/* Header */}
      <RentFrequencyHeader
        title="Rent Frequencies"
        sub="Manage billing cycles, payment schedules, and display status."
        totalCount={totalCount}
        onRefresh={() => loadFrequencyData(true)}
        refreshing={isLoadingRentFrequencies}
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
        {/* Table Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon name="search" size={14} />
            </div>
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by frequency name…"
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
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    statusFilter === tab.value
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
                  "createdAt" | "name",
                  "asc" | "desc"
                ];
                setSortBy(sb);
                setSortOrderDir(sod);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 transition cursor-pointer"
            >
              <option value="name-asc">Name (A → Z)</option>
              <option value="name-desc">Name (Z → A)</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
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

        {/* Error State */}
        {rentFrequenciesError && (
          <div className="p-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between text-rose-700 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold">!</span>
              <span>{rentFrequenciesError}</span>
            </div>
            <Btn size="sm" variant="ghost" onClick={() => loadFrequencyData(true)}>
              Retry
            </Btn>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 pl-6 pr-4">Frequency Name</th>
                <th className="py-3 px-4 w-32">Status</th>
                <th className="py-3 px-4 w-36">Created Date</th>
                <th className="py-3 px-4 text-right w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {isLoadingRentFrequencies && rentFrequencies.length === 0 ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3 pl-6 pr-4">
                      <div className="h-4 w-40 bg-slate-200 rounded" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-5 w-16 bg-slate-200 rounded-full" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="h-4 w-20 bg-slate-200 rounded" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="h-7 w-20 bg-slate-200 rounded inline-block" />
                    </td>
                  </tr>
                ))
              ) : rentFrequencies.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-1">
                        <Icon name="clock" size={20} />
                      </div>
                      <p className="font-semibold text-slate-700">No rent frequencies found</p>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilters
                          ? "No rent frequencies match your search criteria."
                          : "Add the first billing cycle (e.g. Monthly, Quarterly, Annually)."}
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
                          <span>Add First Rent Frequency</span>
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                rentFrequencies.map((item) => {
                  const createdDateFormatted = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  const isTogglingThis = togglingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group select-text"
                    >
                      {/* Name */}
                      <td className="py-3 pl-6 pr-4 min-w-[200px]">
                        <div className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                          {item.name}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <Chip tone={item.isActive ? "mint" : "rose"} dot>
                          {item.isActive ? "Active" : "Inactive"}
                        </Chip>
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-4 text-slate-500 text-[11px] font-medium whitespace-nowrap">
                        {createdDateFormatted}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            disabled={isTogglingThis}
                            title={item.isActive ? "Deactivate rent frequency" : "Activate rent frequency"}
                            className={`p-1.5 rounded-lg border transition cursor-pointer disabled:opacity-50 ${
                              item.isActive
                                ? "border-slate-200 text-slate-600 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200"
                                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            {isTogglingThis ? (
                              <span className="inline-block animate-spin">
                                <Icon name="refresh" size={13} />
                              </span>
                            ) : (
                              <Icon name={item.isActive ? "x" : "check"} size={13} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingFrequency(item)}
                            title="Edit rent frequency"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
                          >
                            <Icon name="pen" size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingFrequency(item)}
                            title="Delete rent frequency"
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
              of <strong className="text-slate-800 font-semibold">{totalCount}</strong> rent frequencies
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1 || isLoadingRentFrequencies}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Previous
              </button>

              <span className="px-3 py-1.5 font-semibold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages || isLoadingRentFrequencies}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      {createOpen && (
        <CreateRentFrequency
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setFeedback({ type: "success", message: "Rent frequency created successfully!" });
            loadFrequencyData(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingFrequency && (
        <EditRentFrequency
          key={editingFrequency.id}
          open={Boolean(editingFrequency)}
          rentFrequency={editingFrequency}
          onClose={() => setEditingFrequency(null)}
          onSuccess={() => {
            setFeedback({ type: "success", message: "Rent frequency updated successfully!" });
            loadFrequencyData(true);
          }}
        />
      )}

      {/* Delete Modal */}
      {deletingFrequency && (
        <DeleteRentFrequency
          key={deletingFrequency.id}
          open={Boolean(deletingFrequency)}
          rentFrequency={deletingFrequency}
          onClose={() => setDeletingFrequency(null)}
          onSuccess={() => {
            setFeedback({ type: "success", message: "Rent frequency deleted successfully!" });
            loadFrequencyData(true);
          }}
        />
      )}
    </div>
  );
}
