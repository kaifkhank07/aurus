"use client";

import React, { useState } from "react";
import { useContentStore } from "@/store/useContentStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import {
  FAQ_CATEGORIES,
  FAQ_CATEGORY_LABELS,
  FaqCategory,
  CreateMultipleFaqsForCategoryInput,
  CreateFaqInput,
} from "@/types/faq.types";

export interface CreateFaqProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultCategory?: FaqCategory;
}

interface BatchFaqRow {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export default function CreateFaq({
  open,
  onClose,
  onSuccess,
  defaultCategory = "general",
}: CreateFaqProps) {
  const { createFaq } = useContentStore();

  // Mode: "batch" (multiple for same category) or "single"
  const [mode, setMode] = useState<"batch" | "single">("batch");

  // Category selection (shared)
  const [category, setCategory] = useState<FaqCategory>(defaultCategory);

  // ── Mode 1: Batch rows for same category ──
  const [batchRows, setBatchRows] = useState<BatchFaqRow[]>([
    { id: "1", question: "", answer: "", sortOrder: 0 },
    { id: "2", question: "", answer: "", sortOrder: 1 },
  ]);

  // ── Mode 2: Single FAQ fields ──
  const [singleQuestion, setSingleQuestion] = useState("");
  const [singleAnswer, setSingleAnswer] = useState("");
  const [singleSortOrder, setSingleSortOrder] = useState<number>(0);
  const [singleIsActive, setSingleIsActive] = useState(true);

  // Validation & status
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) return null;

  const handleAddBatchRow = () => {
    setBatchRows((prev) => [
      ...prev,
      {
        id: String(Date.now() + Math.random()),
        question: "",
        answer: "",
        sortOrder: prev.length,
      },
    ]);
  };

  const handleRemoveBatchRow = (id: string) => {
    if (batchRows.length <= 1) return;
    setBatchRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleBatchRowChange = (
    id: string,
    field: "question" | "answer" | "sortOrder",
    value: string | number
  ) => {
    setBatchRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const resetForm = () => {
    setCategory(defaultCategory);
    setBatchRows([
      { id: "1", question: "", answer: "", sortOrder: 0 },
      { id: "2", question: "", answer: "", sortOrder: 1 },
    ]);
    setSingleQuestion("");
    setSingleAnswer("");
    setSingleSortOrder(0);
    setSingleIsActive(true);
    setClientErrors({});
    setApiError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientErrors({});
    setApiError(null);

    if (mode === "batch") {
      // Validate batch rows
      const validRows = batchRows.filter(
        (r) => r.question.trim().length > 0 || r.answer.trim().length > 0
      );

      if (validRows.length === 0) {
        setClientErrors({ batch: "Please enter at least one question and answer." });
        return;
      }

      for (let i = 0; i < validRows.length; i++) {
        const row = validRows[i];
        if (!row.question.trim() || row.question.trim().length < 3) {
          setClientErrors({
            batch: `Question #${i + 1} must be at least 3 characters long.`,
          });
          return;
        }
        if (!row.answer.trim() || row.answer.trim().length < 3) {
          setClientErrors({
            batch: `Answer #${i + 1} must be at least 3 characters long.`,
          });
          return;
        }
      }

      setIsSubmitting(true);
      const payload: CreateMultipleFaqsForCategoryInput = {
        category,
        faqs: validRows.map((r) => ({
          question: r.question.trim(),
          answer: r.answer.trim(),
          sortOrder: Number(r.sortOrder) || 0,
          isActive: true,
        })),
      };

      const res = await createFaq(payload);
      setIsSubmitting(false);

      if (res.success) {
        resetForm();
        onSuccess();
        onClose();
      } else {
        setApiError(res.message || "Failed to create FAQs. Please verify inputs.");
      }
    } else {
      // Validate single
      const errors: Record<string, string> = {};
      if (!singleQuestion.trim() || singleQuestion.trim().length < 3) {
        errors.question = "Question must be at least 3 characters long.";
      }
      if (!singleAnswer.trim() || singleAnswer.trim().length < 3) {
        errors.answer = "Answer must be at least 3 characters long.";
      }

      if (Object.keys(errors).length > 0) {
        setClientErrors(errors);
        return;
      }

      setIsSubmitting(true);
      const payload: CreateFaqInput = {
        category,
        question: singleQuestion.trim(),
        answer: singleAnswer.trim(),
        sortOrder: Number(singleSortOrder) || 0,
        isActive: singleIsActive,
      };

      const res = await createFaq(payload);
      setIsSubmitting(false);

      if (res.success) {
        resetForm();
        onSuccess();
        onClose();
      } else {
        setApiError(res.message || "Failed to create FAQ. Please verify inputs.");
      }
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
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0">
              <Icon name="plus" size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Add FAQ Content
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Create a single FAQ or multiple questions for the same category at once
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

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          {/* Mode Switcher Tabs */}
          <div className="px-6 pt-5 pb-3 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setMode("batch")}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === "batch"
                      ? "bg-white text-orange-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon name="flow" size={13} />
                  <span>Multiple for Category (Batch)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("single")}
                  className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === "single"
                      ? "bg-white text-orange-600 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon name="fileText" size={13} />
                  <span>Single FAQ</span>
                </button>
              </div>

              {/* Category Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Target Category:
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FaqCategory)}
                  disabled={isSubmitting}
                  className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                >
                  {FAQ_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {FAQ_CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5 flex-1">
            {/* Global API / Client Error banner */}
            {apiError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <Icon name="info" size={14} className="shrink-0 text-rose-500" />
                <span>{apiError}</span>
              </div>
            )}

            {clientErrors.batch && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2">
                <Icon name="info" size={14} className="shrink-0 text-amber-600" />
                <span>{clientErrors.batch}</span>
              </div>
            )}

            {/* MODE 1: MULTIPLE FAQS FOR SAME CATEGORY */}
            {mode === "batch" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Questions for Category:{" "}
                      <span className="text-orange-600">
                        {FAQ_CATEGORY_LABELS[category]}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Add as many question-and-answer pairs as you need. All will be assigned to &quot;{FAQ_CATEGORY_LABELS[category]}&quot;.
                    </p>
                  </div>
                  <Btn
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddBatchRow}
                    disabled={isSubmitting}
                  >
                    <Icon name="plus" size={12} />
                    <span>Add Question Row</span>
                  </Btn>
                </div>

                <div className="space-y-4 pt-1">
                  {batchRows.map((row, idx) => (
                    <div
                      key={row.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3 relative group transition hover:border-slate-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-mono">
                          <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          FAQ #{idx + 1}
                        </span>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <label className="text-[11px] font-medium text-slate-500">
                              Sort Order:
                            </label>
                            <input
                              type="number"
                              value={row.sortOrder}
                              onChange={(e) =>
                                handleBatchRowChange(
                                  row.id,
                                  "sortOrder",
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              className="w-16 px-2 py-0.5 text-xs text-center border border-slate-200 bg-white rounded-md font-mono"
                              min={0}
                            />
                          </div>

                          {batchRows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveBatchRow(row.id)}
                              disabled={isSubmitting}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition cursor-pointer"
                              title="Remove this row"
                            >
                              <Icon name="trash" size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Question input */}
                      <div>
                        <input
                          type="text"
                          value={row.question}
                          onChange={(e) =>
                            handleBatchRowChange(row.id, "question", e.target.value)
                          }
                          placeholder="e.g. How do I book a room at Aurus?"
                          disabled={isSubmitting}
                          className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                      </div>

                      {/* Answer input */}
                      <div>
                        <textarea
                          rows={2}
                          value={row.answer}
                          onChange={(e) =>
                            handleBatchRowChange(row.id, "answer", e.target.value)
                          }
                          placeholder="e.g. You can initiate your reservation directly via our website by selecting your desired residence..."
                          disabled={isSubmitting}
                          className="w-full text-xs font-normal px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-1">
                  <Btn
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddBatchRow}
                    disabled={isSubmitting}
                    className="w-full border-2 border-dashed border-slate-200 hover:border-orange-300 py-3 text-slate-600 hover:text-orange-600 rounded-xl"
                  >
                    <Icon name="plus" size={13} />
                    <span>Add Another Question ({batchRows.length + 1})</span>
                  </Btn>
                </div>
              </div>
            ) : (
              /* MODE 2: SINGLE FAQ CREATION */
              <div className="space-y-4">
                <FormField
                  label="Question *"
                  error={clientErrors.question}
                  hint="Clear, concise student or parent question (max 500 characters)"
                >
                  <TextInput
                    value={singleQuestion}
                    onChange={(e) => setSingleQuestion(e.target.value)}
                    placeholder="e.g. Is there a minimum stay required?"
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField
                  label="Answer *"
                  error={clientErrors.answer}
                  hint="Detailed and helpful response explaining policies, amenities, or pricing"
                >
                  <textarea
                    rows={5}
                    value={singleAnswer}
                    onChange={(e) => setSingleAnswer(e.target.value)}
                    placeholder="Write the comprehensive answer here..."
                    disabled={isSubmitting}
                    className="w-full text-xs font-normal p-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-y"
                  />
                </FormField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Sort Order" hint="Lower numbers appear first">
                    <TextInput
                      type="number"
                      value={singleSortOrder}
                      onChange={(e) =>
                        setSingleSortOrder(parseInt(e.target.value, 10) || 0)
                      }
                      disabled={isSubmitting}
                    />
                  </FormField>

                  <div className="flex flex-col justify-center pt-5">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={singleIsActive}
                        onChange={(e) => setSingleIsActive(e.target.checked)}
                        disabled={isSubmitting}
                        className="w-4 h-4 rounded text-orange-600 border-slate-300 focus:ring-orange-500"
                      />
                      <span className="text-xs font-semibold text-slate-700">
                        Publish immediately (Active)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {mode === "batch"
                ? `Ready to save ${batchRows.filter((r) => r.question.trim().length > 0).length} FAQ(s)`
                : "Single FAQ mode"}
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
                <span>
                  {isSubmitting
                    ? "Saving…"
                    : mode === "batch"
                    ? `Save FAQs for ${FAQ_CATEGORY_LABELS[category]}`
                    : "Save FAQ"}
                </span>
              </Btn>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
