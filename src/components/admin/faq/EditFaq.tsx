"use client";

import React, { useState } from "react";
import { useContentStore } from "@/store/useContentStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import {
  FAQ_CATEGORIES,
  FAQ_CATEGORY_LABELS,
  FaqCategory,
  SafeFaq,
  UpdateFaqInput,
} from "@/types/faq.types";

export interface EditFaqProps {
  open: boolean;
  faq: SafeFaq | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditFaq({ open, faq, onClose, onSuccess }: EditFaqProps) {
  const { updateFaq } = useContentStore();

  const [category, setCategory] = useState<FaqCategory>(faq?.category || "general");
  const [question, setQuestion] = useState(faq?.question || "");
  const [answer, setAnswer] = useState(faq?.answer || "");
  const [sortOrder, setSortOrder] = useState<number>(faq?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState(faq?.isActive ?? true);

  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || !faq) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientErrors({});
    setApiError(null);

    const errors: Record<string, string> = {};
    if (!question.trim() || question.trim().length < 3) {
      errors.question = "Question must be at least 3 characters long.";
    }
    if (!answer.trim() || answer.trim().length < 3) {
      errors.answer = "Answer must be at least 3 characters long.";
    }

    if (Object.keys(errors).length > 0) {
      setClientErrors(errors);
      return;
    }

    setIsSubmitting(true);
    const payload: UpdateFaqInput = {
      category,
      question: question.trim(),
      answer: answer.trim(),
      sortOrder: Number(sortOrder) || 0,
      isActive,
    };

    const res = await updateFaq(faq.id, payload);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setApiError(res.message || "Failed to update FAQ. Please try again.");
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
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0">
              <Icon name="pen" size={17} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Edit FAQ
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Modify question, answer, category, or publishing state
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {apiError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <Icon name="info" size={14} className="shrink-0 text-rose-500" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Category Dropdown */}
          <FormField label="Category *" hint="Choose the section for this FAQ">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as FaqCategory)}
              disabled={isSubmitting}
              className="w-full text-xs font-semibold px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
            >
              {FAQ_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {FAQ_CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
          </FormField>

          {/* Question Input */}
          <FormField
            label="Question *"
            error={clientErrors.question}
            hint="Clear query asked by students or parents"
          >
            <TextInput
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How does check-out work?"
              disabled={isSubmitting}
            />
          </FormField>

          {/* Answer Textarea */}
          <FormField
            label="Answer *"
            error={clientErrors.answer}
            hint="Full response displayed on website FAQ section"
          >
            <textarea
              rows={6}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write the full comprehensive answer..."
              disabled={isSubmitting}
              className="w-full text-xs font-normal p-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-y"
            />
          </FormField>

          {/* Sort Order and Active Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <FormField label="Sort Order" hint="Order within category (lower = first)">
              <TextInput
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                disabled={isSubmitting}
              />
            </FormField>

            <div className="flex flex-col justify-center pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded text-orange-600 border-slate-300 focus:ring-orange-500"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Published and visible (Active)
                </span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
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
              <span>{isSubmitting ? "Saving…" : "Save Changes"}</span>
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
