"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { useMasterStore } from "@/store/useMasterStore";
import { Card, Chip, Btn, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import HostelHeader from "./HostelHeader";
import CreateHostel from "./CreateHostel";
import EditHostel from "./EditHostel";
import HostelDetails from "./HostelDetails";
import DeleteHostel from "./DeleteHostel";
import { SafeHostel, HostelQueryParams, TenantType } from "@/types/hostel.types";
import { getMediaUrl } from "@/lib/media";

const PAGE_LIMIT = 10;
type StatusFilter = "all" | "active" | "inactive";
type TenantFilter = "all" | TenantType;

export default function HostelManage() {
  const {
    hostels,
    hostelsPagination,
    isLoadingHostels,
    hostelsError,
    fetchHostels,
    updateHostel,
  } = useHostelAndEnquiryStore();

  const { cities, fetchCities } = useMasterStore();

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editingHostel, setEditingHostel] = useState<SafeHostel | null>(null);
  const [selectedHostelForDetails, setSelectedHostelForDetails] = useState<SafeHostel | null>(null);
  const [deletingHostel, setDeletingHostel] = useState<SafeHostel | null>(null);

  // Search & Filters state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [tenantFilter, setTenantFilter] = useState<TenantFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "rent" | "title">("createdAt");
  const [sortOrderDir, setSortOrderDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Quick feedback toast
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Load cities for filter dropdown
  useEffect(() => {
    if (cities.length === 0) {
      fetchCities({ limit: 100 });
    }
  }, [cities.length, fetchCities]);

  // Debounce search
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

  const loadHostelData = useCallback(
    async (force = false) => {
      const params: Partial<HostelQueryParams> = {
        page: currentPage,
        limit: PAGE_LIMIT,
        sortBy,
        sortOrderDir,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (selectedCity !== "all") {
        params.city = selectedCity;
      }

      if (tenantFilter !== "all") {
        params.tenantType = tenantFilter;
      }

      if (statusFilter === "active") {
        params.isActive = true;
      } else if (statusFilter === "inactive") {
        params.isActive = false;
      }

      await fetchHostels(params, force);
    },
    [currentPage, debouncedSearch, selectedCity, tenantFilter, statusFilter, sortBy, sortOrderDir, fetchHostels]
  );

  useEffect(() => {
    loadHostelData();
  }, [loadHostelData]);

  const handleToggleStatus = async (item: SafeHostel) => {
    setTogglingId(item.id);
    const nextStatus = !item.isActive;

    const res = await updateHostel(item.id, { isActive: nextStatus });
    setTogglingId(null);

    if (res.success) {
      setFeedback({
        type: "success",
        message: `Property "${item.title}" is now ${nextStatus ? "Active" : "Inactive"}.`,
      });
      loadHostelData(true);
    } else {
      setFeedback({
        type: "error",
        message: res.message || "Failed to update property status.",
      });
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setSelectedCity("all");
    setTenantFilter("all");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrderDir("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      selectedCity !== "all" ||
      tenantFilter !== "all" ||
      statusFilter !== "all" ||
      sortBy !== "createdAt" ||
      sortOrderDir !== "desc"
    );
  }, [search, selectedCity, tenantFilter, statusFilter, sortBy, sortOrderDir]);

  const totalCount = hostelsPagination?.total ?? hostels.length;
  const totalPages =
    hostelsPagination?.totalPages ?? Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  return (
    <div className="space-y-6">
      {/* Header */}
      <HostelHeader
        title="Hostel Residences"
        sub="Manage student and working professional hostel properties, locations, amenities, and room pricing."
        totalCount={totalCount}
        onRefresh={() => loadHostelData(true)}
        refreshing={isLoadingHostels}
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
              placeholder="Search by title, location, or address…"
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
            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 transition cursor-pointer"
            >
              <option value="all">All Cities</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.city}
                </option>
              ))}
            </select>

            {/* Tenant Category Filter */}
            <div className="inline-flex rounded-xl bg-slate-200/60 p-1 text-xs font-semibold text-slate-600">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "co-ed", label: "Co-ed" },
                  { value: "girls", label: "Girls" },
                  { value: "boys", label: "Boys" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setTenantFilter(tab.value);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${tenantFilter === tab.value
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "hover:text-slate-900 text-slate-600"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

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
                  "createdAt" | "rent" | "title",
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
              <option value="rent-asc">Rent (Low to High)</option>
              <option value="rent-desc">Rent (High to Low)</option>
              <option value="title-asc">Title (A → Z)</option>
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
        {hostelsError && (
          <div className="p-4 bg-rose-50 border-b border-rose-100 text-rose-700 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{hostelsError}</span>
            </div>
            {hostelsError.toLowerCase().includes("auth") || hostelsError.toLowerCase().includes("session") ? (
              <Link href="/admin/login">
                <Btn variant="brand" size="sm">
                  Log In
                </Btn>
              </Link>
            ) : (
              <Btn variant="danger" size="sm" onClick={() => loadHostelData(true)}>
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
                <th className="py-3 px-4 w-20">Cover</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4 w-32">Tenant Type</th>
                <th className="py-3 px-4 w-32">Rent Starting</th>
                <th className="py-3 px-4 w-28">Status</th>
                <th className="py-3 px-4 text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingHostels && hostels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <span className="inline-block animate-spin text-orange-500">
                        <Icon name="refresh" size={20} />
                      </span>
                      <span className="text-xs font-medium">Loading hostel residences…</span>
                    </div>
                  </td>
                </tr>
              ) : hostels.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                        <Icon name="home" size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No properties found</p>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilters
                          ? "No hostel residences match your current search and filters."
                          : "Create your first Aurus hostel residence listing with amenities and room photos."}
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
                          <span>Add First Property</span>
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                hostels.map((hostel) => {
                  const frontUrl = getMediaUrl(hostel.frontImage?.url || hostel.frontImage?.publickey);

                  const cityName =
                    typeof hostel.location?.city === "object" && hostel.location?.city !== null
                      ? (hostel.location.city as { city?: string }).city || ""
                      : String(hostel.location?.city || "—");

                  const localityName =
                    typeof hostel.location?.locality === "object" && hostel.location?.locality !== null
                      ? (hostel.location.locality as { name?: string }).name || ""
                      : String(hostel.location?.locality || "—");

                  const formattedRent = new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(hostel.rent);

                  const isTogglingThis = togglingId === hostel.id;

                  return (
                    <tr
                      key={hostel.id}
                      className="hover:bg-slate-50/70 transition-colors group select-text"
                    >
                      {/* Cover Photo */}
                      <td className="py-3 px-4">
                        <div className="w-16 h-11 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {frontUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={frontUrl}
                              alt={hostel.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <Icon name="home" size={18} className="text-slate-400" />
                          )}
                        </div>
                      </td>

                      {/* Property Title & Subtitle */}
                      <td className="py-3 px-4 min-w-[200px]">
                        <button
                          type="button"
                          onClick={() => setSelectedHostelForDetails(hostel)}
                          className="text-left font-bold text-slate-900 group-hover:text-orange-600 transition-colors truncate block max-w-[220px] cursor-pointer hover:underline"
                        >
                          {hostel.title}
                        </button>
                        {hostel.subtitle && (
                          <div className="text-[11px] text-slate-500 truncate max-w-[220px] mt-0.5">
                            {hostel.subtitle}
                          </div>
                        )}
                      </td>

                      {/* Location: Locality & City */}
                      <td className="py-3 px-4 min-w-[160px]">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <Icon name="pin" size={11} className="text-slate-400 shrink-0" />
                          <span className="truncate">{localityName}, {cityName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px] mt-0.5 pl-3.5">
                          {hostel.location?.address}
                        </div>
                      </td>

                      {/* Tenant Category */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 flex-wrap">
                          {hostel.tenantType.map((t) => (
                            <span
                              key={t}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Rent */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-extrabold text-slate-900 text-xs">
                          {formattedRent}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          per {hostel.rentFrequency === "monthly" ? "month" : "year"}
                        </div>
                      </td>

                      {/* Status */}
                      {/* <td className="py-3 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(hostel)}
                          disabled={isTogglingThis}
                          title={hostel.isActive ? "Deactivate listing" : "Activate listing"}
                          className="cursor-pointer"
                        >
                          <Chip tone={hostel.isActive ? "mint" : "rose"} dot>
                            {hostel.isActive ? "Active" : "Inactive"}
                          </Chip>
                        </button>
                      </td> */}
                      <td className="py-3 px-4">
                        <Chip tone={hostel.isActive ? "mint" : "rose"} dot>
                          {hostel.isActive ? "Active" : "Inactive"}
                        </Chip>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* Quick Toggle Status */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(hostel)}
                            disabled={isTogglingThis}
                            title={hostel.isActive ? "Deactivate listing" : "Activate listing"}
                            className={`p-1.5 rounded-lg border transition cursor-pointer disabled:opacity-50 ${hostel.isActive
                              ? "border-slate-200 text-slate-600 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                              }`}
                          >
                            {isTogglingThis ? (
                              <span className="inline-block animate-spin">
                                <Icon name="refresh" size={13} />
                              </span>
                            ) : (
                              <Icon name={hostel.isActive ? "x" : "check"} size={13} />
                            )}
                          </button>

                          {/* View Preview */}
                          <button
                            type="button"
                            onClick={() => setSelectedHostelForDetails(hostel)}
                            title="Preview property"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200 transition cursor-pointer"
                          >
                            <Icon name="eye" size={13} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => setEditingHostel(hostel)}
                            title="Edit property"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
                          >
                            <Icon name="pen" size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => setDeletingHostel(hostel)}
                            title="Delete property"
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
              of <strong className="text-slate-800 font-semibold">{totalCount}</strong> residences
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || isLoadingHostels}
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
                disabled={currentPage >= totalPages || isLoadingHostels}
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
        <CreateHostel
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Hostel residence created successfully.",
            });
            loadHostelData(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingHostel && (
        <EditHostel
          key={editingHostel.id}
          open={!!editingHostel}
          hostel={editingHostel}
          onClose={() => setEditingHostel(null)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Hostel residence updated successfully.",
            });
            loadHostelData(true);
          }}
        />
      )}

      {/* Details Preview Modal */}
      {selectedHostelForDetails && (
        <HostelDetails
          open={!!selectedHostelForDetails}
          hostel={selectedHostelForDetails}
          onClose={() => setSelectedHostelForDetails(null)}
          onEdit={() => {
            const h = selectedHostelForDetails;
            setSelectedHostelForDetails(null);
            setEditingHostel(h);
          }}
          onDelete={() => {
            const h = selectedHostelForDetails;
            setSelectedHostelForDetails(null);
            setDeletingHostel(h);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingHostel && (
        <DeleteHostel
          open={!!deletingHostel}
          hostel={deletingHostel}
          onClose={() => setDeletingHostel(null)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Hostel residence deleted successfully.",
            });
            loadHostelData(true);
          }}
        />
      )}
    </div>
  );
}

