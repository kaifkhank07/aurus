"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { Card, Chip, Btn, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import BookedVisitHeader from "./BookedVisitHeader";
import BookedVisitDetails from "./BookedVisitDetails";
import DeleteBookedVisit from "./DeleteBookedVisit";
import { SafeBookedVisit, BookedVisitQueryParams } from "@/types/booked-visit.types";

const PAGE_LIMIT = 10;

export default function BookedVisitManage() {
  const {
    bookedVisits,
    bookedVisitsPagination,
    isLoadingBookedVisits,
    bookedVisitsError,
    fetchBookedVisits,
  } = useHostelAndEnquiryStore();

  // Dialog states
  const [selectedVisitForDetails, setSelectedVisitForDetails] = useState<SafeBookedVisit | null>(null);
  const [deletingVisit, setDeletingVisit] = useState<SafeBookedVisit | null>(null);

  // Search & Filter & Sorting state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "preferredDate">("createdAt");
  const [sortOrderDir, setSortOrderDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

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

      await fetchBookedVisits(params, force);
    },
    [currentPage, debouncedSearch, sortBy, sortOrderDir, fetchBookedVisits]
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

  const totalCount = bookedVisitsPagination?.total ?? bookedVisits.length;
  const totalPages =
    bookedVisitsPagination?.totalPages ?? Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  return (
    <div className="space-y-6">
      {/* Header */}
      <BookedVisitHeader
        title="Booked Visits"
        sub="Monitor and manage scheduled property visits, appointments, and visitor inquiries."
        totalCount={totalCount}
        onRefresh={() => loadVisitData(true)}
        refreshing={isLoadingBookedVisits}
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
              placeholder="Search by visitor name or phone number…"
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
                <th className="py-3 px-4">Property / Location</th>
                <th className="py-3 px-4">Scheduled Visit</th>
                <th className="py-3 px-4 w-32">Booked On</th>
                <th className="py-3 px-4 text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingBookedVisits && bookedVisits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-14 text-center">
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
                  <td colSpan={6} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                        <Icon name="calendar" size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No booked visits found</p>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilters
                          ? "No booked visit appointments match your search criteria."
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

                  return (
                    <tr
                      key={visit.id}
                      className="hover:bg-slate-50/70 transition-colors group select-text"
                    >
                      {/* Visitor Name & Role */}
                      <td className="py-3 px-4 min-w-[190px]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                            {visit.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                              {visit.name}
                            </div>
                            <div className="text-[11px] font-medium text-slate-500">
                              {visit.iam || "Visitor"}
                            </div>
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
                      <td className="py-3 px-4 min-w-[160px]">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <span className="text-slate-400 shrink-0">
                            <Icon name="pin" size={12} />
                          </span>
                          <span className="truncate max-w-[180px]">{visit.location || "General Visit"}</span>
                        </div>
                      </td>

                      {/* Scheduled Visit Date & Time */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Chip tone={isUpcoming ? "mint" : "slate"}>
                              {formattedVisitDate}
                            </Chip>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium pl-1">
                            <Icon name="clock" size={11} />
                            <span>{visit.preferredTime || "Any Time"}</span>
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
                            <Icon name="eye" size={14} />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingVisit(visit)}
                            title="Delete booked visit"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
                          >
                            <Icon name="trash" size={14} />
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
          onDelete={() => {
            const v = selectedVisitForDetails;
            setSelectedVisitForDetails(null);
            setDeletingVisit(v);
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

