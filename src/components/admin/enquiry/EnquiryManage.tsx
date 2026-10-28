"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { Card, Chip, Btn, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import EnquiryHeader from "./EnquiryHeader";
import EnquiryDetails from "./EnquiryDetails";
import DeleteEnquiry from "./DeleteEnquiry";
import { SafeEnquiry, EnquiryQueryParams, EnquiryType } from "@/types/enquiry.types";

const PAGE_LIMIT = 10;
type FilterType = "all" | EnquiryType;

export default function EnquiryManage() {
  const {
    enquiries,
    enquiriesPagination,
    isLoadingEnquiries,
    enquiriesError,
    fetchEnquiries,
  } = useHostelAndEnquiryStore();

  // Dialog states
  const [selectedEnquiryForDetails, setSelectedEnquiryForDetails] = useState<SafeEnquiry | null>(null);
  const [deletingEnquiry, setDeletingEnquiry] = useState<SafeEnquiry | null>(null);

  // Search & Filter & Sorting state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
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

  const loadEnquiryData = useCallback(
    async (force = false) => {
      const params: Partial<EnquiryQueryParams> = {
        page: currentPage,
        limit: PAGE_LIMIT,
        sortBy: "createdAt",
        sortOrderDir,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (typeFilter !== "all") {
        params.type = typeFilter;
      }

      await fetchEnquiries(params, force);
    },
    [currentPage, debouncedSearch, typeFilter, sortOrderDir, fetchEnquiries]
  );

  useEffect(() => {
    loadEnquiryData();
  }, [loadEnquiryData]);

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
    setTypeFilter("all");
    setSortOrderDir("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      search.trim().length > 0 ||
      typeFilter !== "all" ||
      sortOrderDir !== "desc"
    );
  }, [search, typeFilter, sortOrderDir]);

  const totalCount = enquiriesPagination?.total ?? enquiries.length;
  const totalPages =
    enquiriesPagination?.totalPages ?? Math.max(1, Math.ceil(totalCount / PAGE_LIMIT));

  return (
    <div className="space-y-6">
      {/* Header */}
      <EnquiryHeader
        title="Enquiries"
        sub="Review incoming queries, prospective tenant questions, and callback requests."
        totalCount={totalCount}
        onRefresh={() => loadEnquiryData(true)}
        refreshing={isLoadingEnquiries}
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
              placeholder="Search by name, number, message or location…"
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
            {/* Type Filter Tabs */}
            <div className="inline-flex rounded-xl bg-slate-200/60 p-1 text-xs font-semibold text-slate-600">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "query", label: "Queries" },
                  { value: "request", label: "Requests" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setTypeFilter(tab.value);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    typeFilter === tab.value
                      ? "bg-white text-slate-900 shadow-2xs font-bold"
                      : "hover:text-slate-900 text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Direction Dropdown */}
            <select
              value={sortOrderDir}
              onChange={(e) => {
                setSortOrderDir(e.target.value as "asc" | "desc");
                setCurrentPage(1);
              }}
              className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 transition cursor-pointer"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
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
        {enquiriesError && (
          <div className="p-4 bg-rose-50 border-b border-rose-100 text-rose-700 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">Error:</span>
              <span>{enquiriesError}</span>
            </div>
            {enquiriesError.toLowerCase().includes("auth") || enquiriesError.toLowerCase().includes("session") ? (
              <Link href="/admin/login">
                <Btn variant="brand" size="sm">
                  Log In
                </Btn>
              </Link>
            ) : (
              <Btn variant="danger" size="sm" onClick={() => loadEnquiryData(true)}>
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
                <th className="py-3 px-4 w-28">Type</th>
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Message Snippet</th>
                <th className="py-3 px-4 w-32">Received</th>
                <th className="py-3 px-4 text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingEnquiries && enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <span className="inline-block animate-spin text-amber-500">
                        <Icon name="refresh" size={20} />
                      </span>
                      <span className="text-xs font-medium">Loading enquiries…</span>
                    </div>
                  </td>
                </tr>
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto text-slate-400">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                        <Icon name="mail" size={24} />
                      </div>
                      <p className="text-sm font-bold text-slate-700">No enquiries found</p>
                      <p className="text-xs text-slate-400">
                        {hasActiveFilters
                          ? "No enquiries match your search criteria."
                          : "Incoming inquiries and callback requests from website visitors will appear here."}
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
                enquiries.map((enquiry) => {
                  const isQuery = enquiry.type === "query";
                  const receivedFormatted = enquiry.createdAt
                    ? new Date(enquiry.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  const cleanPhone = enquiry.number.replace(/\D/g, "");

                  return (
                    <tr
                      key={enquiry.id}
                      className="hover:bg-slate-50/70 transition-colors group select-text"
                    >
                      {/* Enquiry Type Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <Chip tone={isQuery ? "amber" : "sea"}>
                          {isQuery ? "Query" : "Request"}
                        </Chip>
                      </td>

                      {/* Sender Name & Role */}
                      <td className="py-3 px-4 min-w-[180px]">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs text-white ${
                              isQuery
                                ? "bg-gradient-to-br from-amber-500 to-orange-600"
                                : "bg-gradient-to-br from-sky-500 to-indigo-600"
                            }`}
                          >
                            {enquiry.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                              {enquiry.name}
                            </div>
                            <div className="text-[11px] font-medium text-slate-500">
                              {enquiry.iam || "Prospective Tenant"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact Number */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${cleanPhone}`}
                            className="font-mono text-slate-800 hover:text-amber-600 font-semibold transition"
                            title="Call sender"
                          >
                            {enquiry.number}
                          </a>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(enquiry.number, enquiry.id)}
                            title="Copy number"
                            className="text-slate-400 hover:text-slate-700 p-1 rounded transition cursor-pointer"
                          >
                            {copiedId === enquiry.id ? (
                              <span className="text-[10px] text-emerald-600 font-bold">✓</span>
                            ) : (
                              <Icon name="copy" size={11} />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 min-w-[140px]">
                        {enquiry.location ? (
                          <div className="flex items-center gap-1 text-slate-700 font-medium truncate max-w-[160px]">
                            <Icon name="pin" size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate">{enquiry.location}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Message Preview */}
                      <td className="py-3 px-4 max-w-[240px]">
                        {enquiry.message ? (
                          <button
                            type="button"
                            onClick={() => setSelectedEnquiryForDetails(enquiry)}
                            className="text-left text-slate-600 hover:text-slate-900 truncate block w-full cursor-pointer hover:underline text-xs"
                            title="Click to view full message"
                          >
                            {enquiry.message}
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            {isQuery ? "No message" : "Callback request"}
                          </span>
                        )}
                      </td>

                      {/* Received Date */}
                      <td className="py-3 px-4 text-slate-500 text-[11px] font-medium whitespace-nowrap">
                        {receivedFormatted}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          {/* Details Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedEnquiryForDetails(enquiry)}
                            title="View enquiry details"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-amber-50 hover:border-amber-200 transition cursor-pointer"
                          >
                            <Icon name="eye" size={14} />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingEnquiry(enquiry)}
                            title="Delete enquiry"
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
              of <strong className="text-slate-800 font-semibold">{totalCount}</strong> enquiries
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || isLoadingEnquiries}
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
                disabled={currentPage >= totalPages || isLoadingEnquiries}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Details Modal */}
      {selectedEnquiryForDetails && (
        <EnquiryDetails
          open={!!selectedEnquiryForDetails}
          enquiry={selectedEnquiryForDetails}
          onClose={() => setSelectedEnquiryForDetails(null)}
          onDelete={() => {
            const e = selectedEnquiryForDetails;
            setSelectedEnquiryForDetails(null);
            setDeletingEnquiry(e);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingEnquiry && (
        <DeleteEnquiry
          open={!!deletingEnquiry}
          enquiry={deletingEnquiry}
          onClose={() => setDeletingEnquiry(null)}
          onSuccess={() => {
            setFeedback({
              type: "success",
              message: "Enquiry record deleted successfully.",
            });
            loadEnquiryData(true);
          }}
        />
      )}
    </div>
  );
}

