"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useMasterStore } from "@/store/useMasterStore";
import { Card, Chip, Btn, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import AmenityHeader from "./AmenityHeader";
import CreateAmenity from "./CreateAmenity";
import EditAmenity from "./EditAmenity";
import DeleteAmenity from "./DeleteAmenity";
import { SafeAmenity, AmenityQueryParams } from "@/types/amenity.types";
import { getMediaUrl } from "@/lib/media";

const PAGE_LIMIT = 10;
type StatusFilter = "all" | "active" | "inactive";

export default function AmenityManage() {
  const {
    amenities,
    amenitiesPagination,
    isLoadingAmenities,
    amenitiesError,
    fetchAmenities,
    updateAmenity,
  } = useMasterStore();

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<SafeAmenity | null>(null);
  const [deletingAmenity, setDeletingAmenity] = useState<SafeAmenity | null>(null);

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

  const loadAmenityData = useCallback(
    async (force = false) => {
      const params: Partial<AmenityQueryParams> = {
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

      await fetchAmenities(params, force);
    },
    [currentPage, debouncedSearch, statusFilter, sortBy, sortOrderDir, fetchAmenities]
  );

  useEffect(() => {
    loadAmenityData();
  }, [loadAmenityData]);

  const handleToggleStatus = async (item: SafeAmenity) => {
    setTogglingId(item.id);
    const nextStatus = !item.isActive;

    const res = await updateAmenity(item.id, { isActive: nextStatus });
    setTogglingId(null);

    if (res.success) {
      setFeedback({
        type: "success",
        message: `Amenity "${item.name}" is now ${nextStatus ? "Active" : "Inactive"}.`,
      });
      loadAmenityData(true);
    } else {
      setFeedback({
        type: "error",
        message: res.message || "Failed to update amenity status.",
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

  const totalCount = amenitiesPagination?.total ?? amenities.length;
  const totalPages =
    amenitiesPagination?.totalPages ?? Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  return (
    <div className="space-y-6">
      {/* Header */}
      <AmenityHeader
        title="Residence Amenities"
        sub="Marketplace facilities, student amenities, and display status management."
        totalCount={totalCount}
        onRefresh={() => loadAmenityData(true)}
        refreshing={isLoadingAmenities}
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
              placeholder="Search by amenity name…"
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

        {/* Server Error Alert */}
        {amenitiesError && (
          <div className="p-4 bg-rose-50 border-b border-rose-100 text-rose-700 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{amenitiesError}</span>
            </div>
            {amenitiesError.toLowerCase().includes("auth") || amenitiesError.toLowerCase().includes("session") ? (
              <Link href="/admin/login">
                <Btn variant="brand" size="sm">
                  Log In
                </Btn>
              </Link>
            ) : (
              <Btn variant="danger" size="sm" onClick={() => loadAmenityData(true)}>
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
                <th className="py-3 px-4 w-14">Icon</th>
                <th className="py-3 px-4">Amenity Name</th>
                <th className="py-3 px-4 w-28">Status</th>
                <th className="py-3 px-4 w-32">Created</th>
                <th className="py-3 px-4 text-right w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingAmenities && amenities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <span className="inline-block animate-spin text-orange-500">
                        <Icon name="refresh" size={20} />
                      </span>
                      <span className="text-xs font-medium">Loading amenities…</span>
                    </div>
                  </td>
                </tr>
              ) : amenities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                        <Icon name="flow" size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No amenities found</p>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilters
                          ? "No amenities match your search criteria."
                          : "Add the first residence amenity (e.g. Wi-Fi, Gym, Security)."}
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
                          <span>Add First Amenity</span>
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                amenities.map((item) => {
                  const createdDateFormatted = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  const imageUrl = getMediaUrl(item.image?.url || item.image?.publickey);

                  const isTogglingThis = togglingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group select-text"
                    >
                      {/* Icon */}
                      <td className="py-3 px-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <Icon name="flow" size={16} className="text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 min-w-[180px]">
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
                            title={item.isActive ? "Deactivate amenity" : "Activate amenity"}
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
                            onClick={() => setEditingAmenity(item)}
                            title="Edit amenity"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
                          >
                            <Icon name="pen" size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingAmenity(item)}
                            title="Delete amenity"
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
              of <strong className="text-slate-800 font-semibold">{totalCount}</strong> amenities
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1 || isLoadingAmenities}
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
                disabled={currentPage >= totalPages || isLoadingAmenities}
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
        <CreateAmenity
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setFeedback({ type: "success", message: "Amenity created successfully!" });
            loadAmenityData(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingAmenity && (
        <EditAmenity
          key={editingAmenity.id}
          open={Boolean(editingAmenity)}
          amenity={editingAmenity}
          onClose={() => setEditingAmenity(null)}
          onSuccess={() => {
            setFeedback({ type: "success", message: "Amenity updated successfully!" });
            loadAmenityData(true);
          }}
        />
      )}

      {/* Delete Modal */}
      {deletingAmenity && (
        <DeleteAmenity
          key={deletingAmenity.id}
          open={Boolean(deletingAmenity)}
          amenity={deletingAmenity}
          onClose={() => setDeletingAmenity(null)}
          onSuccess={() => {
            setFeedback({ type: "success", message: "Amenity deleted successfully!" });
            loadAmenityData(true);
          }}
        />
      )}
    </div>
  );
}
