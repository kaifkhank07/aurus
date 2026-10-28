"use client";

import React, { useState } from "react";
import { useContentStore } from "@/store/useContentStore";
import { Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { SafeFaq } from "@/types/faq.types";

export interface DeleteFaqProps {
  open: boolean;
  faq?: SafeFaq | null;
  bulkIds?: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteFaq({
  open,
  faq,
  bulkIds,
  onClose,
  onSuccess,
}: DeleteFaqProps) {
  const { deleteFaq, bulkDeleteFaqs } = useContentStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const isBulk = Boolean(bulkIds && bulkIds.length > 0 && !faq);

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      if (isBulk && bulkIds) {
        const res = await bulkDeleteFaqs(bulkIds);
        setIsDeleting(false);
        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setError(res.message || "Failed to delete selected FAQs. Please try again.");
        }
      } else if (faq) {
        const res = await deleteFaq(faq.id);
        setIsDeleting(false);
        if (res.success) {
          onSuccess();
          onClose();
        } else {
          setError(res.message || "Failed to delete FAQ. Please try again.");
        }
      }
    } catch (err) {
      setIsDeleting(false);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  };

  const title = isBulk
    ? `Delete ${bulkIds?.length} FAQs?`
    : "Delete FAQ?";

  const message = isBulk
    ? `Are you sure you want to delete these ${bulkIds?.length} selected FAQs? This action is permanent and cannot be undone.`
    : `Are you sure you want to delete this FAQ?`;

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
                {title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Permanent deletion confirmation
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
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>

          {faq && (
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 uppercase tracking-wider font-mono">
                <span>{faq.category}</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                {faq.question}
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <Icon name="info" size={14} className="shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2.5">
          <Btn
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Btn>
          <Btn
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Icon name="trash" size={13} />
            <span>{isDeleting ? "Deleting…" : isBulk ? `Delete ${bulkIds?.length} FAQs` : "Delete FAQ"}</span>
          </Btn>
        </div>
      </div>
    </div>
  );
}
