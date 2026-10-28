"use client";

import React, { useState } from "react";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { Btn, Chip } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { SafeEnquiry } from "@/types/enquiry.types";

export interface DeleteEnquiryProps {
  open: boolean;
  enquiry: SafeEnquiry | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteEnquiry({
  open,
  enquiry,
  onClose,
  onSuccess,
}: DeleteEnquiryProps) {
  const { deleteEnquiry } = useHostelAndEnquiryStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open || !enquiry) return null;

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    const res = await deleteEnquiry(enquiry.id);
    setIsDeleting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setError(res.message || "Failed to delete enquiry. Please try again.");
    }
  };

  const isQuery = enquiry.type === "query";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Icon name="trash" size={17} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Delete Enquiry
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Lead record removal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <Icon name="x" size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
              <span className="text-rose-500 shrink-0 font-bold">!</span>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <div className="text-sm text-slate-600 leading-relaxed space-y-2">
            <p>
              Are you sure you want to delete the enquiry from{" "}
              <strong className="text-slate-900 font-bold">
                &ldquo;{enquiry.name}&rdquo;
              </strong>{" "}
              ({enquiry.number})?
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Type: </span>
                <Chip tone={isQuery ? "amber" : "sea"}>
                  {isQuery ? "General Query" : "Callback Request"}
                </Chip>
              </div>
              {enquiry.message && (
                <div className="text-slate-600 line-clamp-2 italic pt-1 border-t border-slate-200/60">
                  &ldquo;{enquiry.message}&rdquo;
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 pt-1">
              This action cannot be undone. The enquiry record will be permanently removed from the system.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Btn
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Btn>
          <Btn
            variant="danger"
            size="md"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="inline-block animate-spin">
                  <Icon name="refresh" size={13} />
                </span>
                <span>Deleting…</span>
              </>
            ) : (
              <>
                <Icon name="trash" size={13} />
                <span>Delete Lead</span>
              </>
            )}
          </Btn>
        </div>
      </div>
    </div>
  );
}

