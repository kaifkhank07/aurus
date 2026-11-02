"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { Card, Chip, Btn, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import BookedVisitHeader from "./BookedVisitHeader";
import BookedVisitDetails from "./BookedVisitDetails";
import CreateBookedVisit from "./CreateBookedVisit";
import EditBookedVisit from "./EditBookedVisit";
import DeleteBookedVisit from "./DeleteBookedVisit";
import {
  SafeBookedVisit,
  BookedVisitQueryParams,
  BookedVisitStatus,
  BOOKED_VISIT_STATUS_LABELS,
} from "@/types/booked-visit.types";

const PAGE_LIMIT = 10;
type StatusFilter = "all" | BookedVisitStatus;

export default function BookedVisitManage() {
  const {
    bookedVisits,
    bookedVisitsPagination,
    isLoadingBookedVisits,
    bookedVisitsError,
    fetchBookedVisits,
    updateBookedVisit,
  } = useHostelAndEnquiryStore();

  // Dialog states
  const [selectedVisitForDetails, setSelectedVisitForDetails] = useState<SafeBookedVisit | null>(null);
  const [editingVisit, setEditingVisit] = useState<SafeBookedVisit | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingVisit, setDeletingVisit] = useState<SafeBookedVisit | null>(null);

  // Search & Filter & Sorting state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "preferredDate">("createdAt");
  const [sortOrderDir, setSortOrderDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Status updating indicator
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Quick feedback toast
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const loadVisitData = useCallback(
    async (force = false) => {
      const params: Partial<BookedVisitQueryParams> = {
        page: currentPage,
        limit: PAGE_LIMIT,
        sortBy,
        sortOrderDir,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      await fetchBookedVisits(params, force);
    },
    [currentPage, debouncedSearch, statusFilter, sortBy, sortOrderDir, fetchBookedVisits]
  );

  useEffect(() => {
    loadVisitData();
  }, [loadVisitData]);

  const handleCopyPhone = (number: string, id: string) => {
    navigator.clipboard.writeText(number);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleInlineStatusChange = async (visit: SafeBookedVisit, newStatus: BookedVisitStatus) => {
    if (visit.status === newStatus || updatingStatusId) return;

    setUpdatingStatusId(visit.id);
    try {
      const res = await updateBookedVisit(visit.id, { status: newStatus });
      if (res.success) {
        setFeedback({
          type: "success",
          message: `Status for "${visit.name}" changed to ${BOOKED_VISIT_STATUS_LABELS[newStatus]}.`,
        });
        if (selectedVisitForDetails?.id === visit.id) {
          setSelectedVisitForDetails({ ...selectedVisitForDetails, status: newStatus });
        }
      } else {
        setFeedback({
          type: "error",
          message: res.message || "Failed to update visit status.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "An unexpected error occurred while updating status.",
      });
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrderDir("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      statusFilter !== "all" ||
      sortBy !== "createdAt" ||
      sortOrderDir !== "desc"
    );
  }, [search, statusFilter, sortBy, sortOrderDir]);

  const totalCount = bookedVisitsPagination?.total ?? bookedVisits.length;
  const totalPages =
    bookedVisitsPagination?.totalPages ?? Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  const statusToneMap: Record<BookedVisitStatus, "amber" | "sea" | "mint"> = {
    new: "amber",
    read: "sea",
    complete: "mint",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <BookedVisitHeader
        title="Booked Visits"
        sub="Monitor and manage scheduled property visits, appointments, and visitor inquiries."
        totalCount={totalCount}
        onRefresh={() => loadVisitData(true)}
        refreshing={isLoadingBookedVisits}
        onAdd={() => setIsCreateOpen(true)}
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
              placeholder="Search by visitor name, phone, email, college…"
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
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as StatusFilter);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 transition cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="complete">Complete</option>
            </select>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrderDir}`}
              onChange={(e) => {
                const [sb, sod] = e.target.value.split("-") as [
                  "createdAt" | "preferredDate",
                  "asc" | "desc"
                ];
                setSortBy(sb);
                setSortOrderDir(sod);
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 transition cursor-pointer"
            >
              <option value="createdAt-desc">Newest Booking First</option>
              <option value="createdAt-asc">Oldest Booking First</option>
              <option value="preferredDate-asc">Visit Date (Earliest First)</option>
              <option value="preferredDate-desc">Visit Date (Latest First)</option>
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
        {bookedVisitsError && (
          <div className="p-4 bg-rose-50 border-b border-rose-100 text-rose-700 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{bookedVisitsError}</span>
            </div>
            {bookedVisitsError.toLowerCase().includes("auth") || bookedVisitsError.toLowerCase().includes("session") ? (
              <Link href="/admin/login">
                <Btn variant="brand" size="sm">
                  Log In
                </Btn>
              </Link>
            ) : (
              <Btn variant="danger" size="sm" onClick={() => loadVisitData(true)}>
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
                <th className="py-3 px-4">Visitor</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Scheduled Visit</th>
                <th className="py-3 px-4 w-36">Status</th>
                <th className="py-3 px-4 w-28">Booked On</th>
                <th className="py-3 px-4 text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingBookedVisits && bookedVisits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <span className="inline-block animate-spin text-sky-500">
                        <Icon name="refresh" size={20} />
                      </span>
                      <span className="text-xs font-medium">Loading booked visits…</span>
                    </div>
                  </td>
                </tr>
              ) : bookedVisits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                        <Icon name="calendar" size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No booked visits found</p>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilters
                          ? "No booked visit appointments match your search or filter criteria."
                          : "Scheduled property visit appointments from website visitors will appear here."}
                      </p>
                      {hasActiveFilters && (
                        <Btn variant="ghost" size="sm" onClick={handleResetFilters} className="mt-2">
                          Clear Filters
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                bookedVisits.map((visit) => {
                  const visitDateObj = visit.preferredDate ? new Date(visit.preferredDate) : null;
                  const isValidDate = visitDateObj && !isNaN(visitDateObj.getTime());
                  const formattedVisitDate = isValidDate
                    ? visitDateObj.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    : visit.preferredDate || "—";

                  const isUpcoming = isValidDate
                    ? new Date(visitDateObj.toDateString()) >= new Date(new Date().toDateString())
                    : false;

                  const bookedOnFormatted = visit.createdAt
                    ? new Date(visit.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                    : "—";

                  const cleanPhone = visit.number.replace(/\D/g, "");
                  const isUpdatingThis = updatingStatusId === visit.id;

                  return (
                    <tr
                      key={visit.id}
                      className="hover:bg-slate-50/70 transition-colors group select-text"
                    >
                      {/* Visitor Name, Email & College */}
                      <td className="py-3 px-4 min-w-[210px]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {visit.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                              {visit.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate" title={visit.email}>
                              {visit.email}
                            </div>
                            {/*   <div className="text-[10px] text-slate-400 truncate" title={visit.college}>
                              {visit.college}
                            </div> */}
                          </div>
                        </div>
                      </td>

                      {/* Contact Number */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="font-mono text-slate-800 hover:text-sky-600 font-semibold transition"
                            title="Call visitor"
                          >
                            {visit.number}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(visit.number, visit.id)}
                            title="Copy number"
                            className="text-slate-400 hover:text-slate-700 p-1 rounded transition cursor-pointer"
                          >
                            {copiedId === visit.id ? (
                              <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                            ) : (
                              <Icon name="copy" size={11} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Target Location */}
                      <td className="py-3 px-4 min-w-[150px]">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <span className="text-slate-400 shrink-0">
                            <Icon name="pin" size={12} />
                          </span>
                          <span className="truncate max-w-[170px]" title={visit.location}>
                            {visit.location || "General Visit"}
                          </span>
                        </div>
                      </td>

                      {/* Scheduled Visit Date */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Chip tone={isUpcoming ? "mint" : "slate"}>
                            {formattedVisitDate}
                          </Chip>
                        </div>
                      </td>

                      {/* Status Management */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="relative inline-flex items-center">
                          <select
                            value={visit.status}
                            disabled={isUpdatingThis}
                            onChange={(e) =>
                              handleInlineStatusChange(
                                visit,
                                e.target.value as BookedVisitStatus
                              )
                            }
                            className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition cursor-pointer appearance-none pr-6 ${visit.status === "new"
                              ? "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100"
                              : visit.status === "read"
                                ? "bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100"
                                : "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                              } ${isUpdatingThis ? "opacity-50 cursor-wait" : ""}`}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="complete">Complete</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-500">
                            <Icon name="down" size={10} />
                          </div>
                        </div>
                      </td>

                      {/* Booked On */}
                      <td className="py-3 px-4 text-slate-500 text-[11px] font-medium whitespace-nowrap">
                        {bookedOnFormatted}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* Details Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedVisitForDetails(visit)}
                            title="View appointment details"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-sky-600 hover:bg-sky-50 hover:border-sky-200 transition cursor-pointer"
                          >
                            <Icon name="eye" size={13} />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            onClick={() => setEditingVisit(visit)}
                            title="Edit appointment"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-sky-600 hover:bg-sky-50 hover:border-sky-200 transition cursor-pointer"
                          >
                            <Icon name="pen" size={13} />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingVisit(visit)}
                            title="Delete booked visit"
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
              of <strong className="text-slate-800 font-semibold">{totalCount}</strong> visits
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || isLoadingBookedVisits}
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
                disabled={currentPage >= totalPages || isLoadingBookedVisits}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Details Modal */}
      {selectedVisitForDetails && (
        <BookedVisitDetails
          open={!!selectedVisitForDetails}
          visit={selectedVisitForDetails}
          onClose={() => setSelectedVisitForDetails(null)}
          onEdit={() => {
            const v = selectedVisitForDetails;
            setSelectedVisitForDetails(null);
            setEditingVisit(v);
          }}
          onDelete={() => {
            const v = selectedVisitForDetails;
            setSelectedVisitForDetails(null);
            setDeletingVisit(v);
          }}
          onStatusChange={(newStatus) => {
            setSelectedVisitForDetails((prev) =>
              prev ? { ...prev, status: newStatus } : null
            );
            loadVisitData(true);
          }}
        />
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <CreateBookedVisit
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Booked visit appointment created successfully.",
            });
            loadVisitData(true);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingVisit && (
        <EditBookedVisit
          open={!!editingVisit}
          visit={editingVisit}
          onClose={() => setEditingVisit(null)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Booked visit appointment updated successfully.",
            });
            loadVisitData(true);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingVisit && (
        <DeleteBookedVisit
          open={!!deletingVisit}
          visit={deletingVisit}
          onClose={() => setDeletingVisit(null)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Booked visit appointment removed successfully.",
            });
            loadVisitData(true);
          }}
        />
      )}
    </div>
  );
}
