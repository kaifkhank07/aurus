"use client";

import React, { useState } from "react";
import { useContentStore } from "@/store/useContentStore";
import { Btn, FormField } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import {
  FAQ_CATEGORIES,
  FAQ_CATEGORY_LABELS,
  FaqCategory,
  SafeFaq,
  BulkUpdateFaqItem,
} from "@/types/faq.types";

export interface BulkEditFaqProps {
  open: boolean;
  selectedFaqs: SafeFaq[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkEditFaq({
  open,
  selectedFaqs,
  onClose,
  onSuccess,
}: BulkEditFaqProps) {
  const { bulkUpdateFaqs } = useContentStore();

  // Mode: "unified" (apply category/status to all) or "individual" (inline edit rows)
  const [targetCategory, setTargetCategory] = useState<FaqCategory | "keep">("keep");
  const [targetStatus, setTargetStatus] = useState<"keep" | "active" | "inactive">("keep");

  const [items, setItems] = useState<BulkUpdateFaqItem[]>(() =>
    selectedFaqs.map((f) => ({
      id: f.id,
      question: f.question,
      sortOrder: f.sortOrder,
      isActive: f.isActive,
      category: f.category,
    }))
  );

  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || selectedFaqs.length === 0) return null;

  const handleItemChange = (
    id: string,
    field: "question" | "sortOrder" | "isActive" | "category",
    value: unknown
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleApplyUnifiedCategory = (cat: FaqCategory | "keep") => {
    setTargetCategory(cat);
    if (cat !== "keep") {
      setItems((prev) => prev.map((item) => ({ ...item, category: cat })));
    }
  };

  const handleApplyUnifiedStatus = (st: "keep" | "active" | "inactive") => {
    setTargetStatus(st);
    if (st !== "keep") {
      const activeBool = st === "active";
      setItems((prev) => prev.map((item) => ({ ...item, isActive: activeBool })));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    // Validate questions
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.question && it.question.trim().length < 3) {
        setApiError(`Question #${i + 1} must be at least 3 characters.`);
        return;
      }
    }

    setIsSubmitting(true);
    const res = await bulkUpdateFaqs(items);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setApiError(res.message || "Failed to update selected FAQs.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0">
              <Icon name="flow" size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Bulk Edit FAQs
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                  {selectedFaqs.length} Items Selected
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Update category, publish status, or sort order across multiple questions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Close"
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          {/* Quick Batch Actions Toolbar */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Assign Category to All" hint="Changes category for all selected questions">
              <select
                value={targetCategory}
                onChange={(e) =>
                  handleApplyUnifiedCategory(e.target.value as FaqCategory | "keep")
                }
                disabled={isSubmitting}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
              >
                <option value="keep">— Keep Current Categories —</option>
                {FAQ_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    Set all to: {FAQ_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Set Status for All" hint="Publish or unpublish all selected questions">
              <select
                value={targetStatus}
                onChange={(e) =>
                  handleApplyUnifiedStatus(
                    e.target.value as "keep" | "active" | "inactive"
                  )
                }
                disabled={isSubmitting}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
              >
                <option value="keep">— Keep Current Statuses —</option>
                <option value="active">Publish all (Active)</option>
                <option value="inactive">Unpublish all (Inactive / Draft)</option>
              </select>
            </FormField>
          </div>

          <div className="p-6 space-y-4 flex-1">
            {apiError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <Icon name="info" size={14} className="shrink-0 text-rose-500" />
                <span>{apiError}</span>
              </div>
            )}

            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Selected Questions List ({items.length})
              </span>

              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center gap-3 transition hover:border-slate-300"
                >
                  <span className="w-6 h-6 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>

                  {/* Question input */}
                  <div className="flex-1 min-w-0 w-full">
                    <input
                      type="text"
                      value={item.question || ""}
                      onChange={(e) =>
                        handleItemChange(item.id, "question", e.target.value)
                      }
                      placeholder="Question..."
                      disabled={isSubmitting}
                      className="w-full text-xs font-semibold px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  {/* Category select per row */}
                  <div className="w-full md:w-44 shrink-0">
                    <select
                      value={item.category || "general"}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "category",
                          e.target.value as FaqCategory
                        )
                      }
                      disabled={isSubmitting}
                      className="w-full text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 cursor-pointer"
                    >
                      {FAQ_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {FAQ_CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort order per row */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11px] text-slate-500">Order:</span>
                    <input
                      type="number"
                      value={item.sortOrder ?? 0}
                      onChange={(e) =>
                        handleItemChange(
                          item.id,
                          "sortOrder",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      disabled={isSubmitting}
                      className="w-14 px-2 py-1 text-xs text-center border border-slate-200 bg-white rounded-md font-mono"
                      min={0}
                    />
                  </div>

                  {/* Active toggle per row */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700 select-none">
                      <input
                        type="checkbox"
                        checked={item.isActive ?? true}
                        onChange={(e) =>
                          handleItemChange(item.id, "isActive", e.target.checked)
                        }
                        disabled={isSubmitting}
                        className="w-3.5 h-3.5 rounded text-orange-600 border-slate-300 focus:ring-orange-500"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Updating {items.length} FAQs simultaneously
            </span>

            <div className="flex items-center gap-2.5">
              <Btn
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Btn>
              <Btn
                type="submit"
                variant="brand"
                size="sm"
                disabled={isSubmitting}
              >
                <Icon name="check" size={13} />
                <span>{isSubmitting ? "Updating…" : `Update ${items.length} FAQs`}</span>
              </Btn>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
