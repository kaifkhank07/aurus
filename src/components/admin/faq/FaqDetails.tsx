"use client";

import React, { useState } from "react";
import { Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { SafeFaq, FAQ_CATEGORY_LABELS, FaqCategory } from "@/types/faq.types";

export interface FaqDetailsProps {
  open: boolean;
  faq: SafeFaq | null;
  onClose: () => void;
  onEdit?: (faq: SafeFaq) => void;
}

export const CATEGORY_COLORS: Record<
  FaqCategory,
  { bg: string; text: string; border: string; dot: string }
> = {
  general: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-400",
  },
  booking: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    dot: "bg-orange-500",
  },
  "payment and pricing": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  safety: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  "living in aurus": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    dot: "bg-purple-500",
  },
  "move-in and move-out": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
};

export default function FaqDetails({ open, faq, onClose, onEdit }: FaqDetailsProps) {
  const [copiedQuestion, setCopiedQuestion] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);

  if (!open || !faq) return null;

  const categoryStyle =
    CATEGORY_COLORS[faq.category] || {
      bg: "bg-slate-50",
      text: "text-slate-700",
      border: "border-slate-200",
      dot: "bg-slate-400",
    };

  const categoryLabel = FAQ_CATEGORY_LABELS[faq.category] || faq.category;

  const handleCopyQuestion = () => {
    navigator.clipboard.writeText(faq.question);
    setCopiedQuestion(true);
    setTimeout(() => setCopiedQuestion(false), 2000);
  };

  const handleCopyAnswer = () => {
    navigator.clipboard.writeText(faq.answer);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  const formattedCreated = new Date(faq.createdAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedUpdated = new Date(faq.updatedAt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0">
              <Icon name="info" size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  FAQ Details
                </h3>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${categoryStyle.dot}`} />
                  {categoryLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Detailed view of question, answer, and publishing status
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
                Status
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  faq.isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    faq.isActive ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {faq.isActive ? "Published (Active)" : "Draft (Inactive)"}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
                Sort Order
              </span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                #{faq.sortOrder}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
                Created
              </span>
              <span className="text-xs font-medium text-slate-600 truncate block">
                {formattedCreated}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-0.5">
                Last Updated
              </span>
              <span className="text-xs font-medium text-slate-600 truncate block">
                {formattedUpdated}
              </span>
            </div>
          </div>

          {/* Question Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Icon name="help" size={13} className="text-orange-500" />
                Question
              </span>
              <button
                type="button"
                onClick={handleCopyQuestion}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedQuestion ? (
                  <>
                    <Icon name="check" size={12} className="text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Icon name="card" size={12} />
                    <span>Copy Question</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-orange-50/30 border border-orange-100 text-slate-900 font-semibold text-base leading-relaxed">
              {faq.question}
            </div>
          </div>

          {/* Answer Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Icon name="chat" size={13} className="text-slate-400" />
                Answer
              </span>
              <button
                type="button"
                onClick={handleCopyAnswer}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedAnswer ? (
                  <>
                    <Icon name="check" size={12} className="text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Icon name="card" size={12} />
                    <span>Copy Answer</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {faq.answer}
            </div>
          </div>

          {/* Technical Metadata */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>ID: {faq.id}</span>
            <span>Category: {faq.category}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2.5">
          <Btn variant="ghost" size="sm" onClick={onClose}>
            Close
          </Btn>
          {onEdit && (
            <Btn
              variant="brand"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(faq);
              }}
            >
              <Icon name="pen" size={12} />
              <span>Edit FAQ</span>
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}
