"use client";

import React, { useState } from "react";
import { SafeEnquiry } from "@/types/enquiry.types";
import { Chip, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface EnquiryDetailsProps {
  open: boolean;
  enquiry: SafeEnquiry | null;
  onClose: () => void;
  onDelete?: () => void;
}

export default function EnquiryDetails({
  open,
  enquiry,
  onClose,
  onDelete,
}: EnquiryDetailsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!open || !enquiry) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const createdFormatted = enquiry.createdAt
    ? new Date(enquiry.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

  const cleanPhone = enquiry.number.replace(/\D/g, "");
  const isQuery = enquiry.type === "query";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-amber-50/20">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                isQuery ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
              }`}
            >
              <Icon name={isQuery ? "mail" : "phone"} size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Enquiry Details
                </h3>
                <Chip tone={isQuery ? "amber" : "sea"}>
                  {isQuery ? "General Query" : "Callback Request"}
                </Chip>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Submission ID: <span className="font-mono text-slate-700">{enquiry.id.slice(-8)}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <Icon name="x" size={15} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Sender Overview Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl text-white font-bold text-lg flex items-center justify-center shadow-sm shrink-0 ${
                  isQuery
                    ? "bg-gradient-to-br from-amber-500 to-orange-600"
                    : "bg-gradient-to-br from-sky-500 to-indigo-600"
                }`}
              >
                {enquiry.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 leading-tight">
                  {enquiry.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 font-medium">Profile:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-slate-200 text-slate-700">
                    {enquiry.iam || "Prospective Tenant"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Icon name="phone" size={12} /> Contact Number
              </span>
              {copiedField === "phone" && (
                <span className="text-[11px] font-semibold text-emerald-600 animate-in fade-in">
                  Copied!
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="text-base font-bold text-slate-900 font-mono tracking-tight">
                {enquiry.number}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopy(enquiry.number, "phone")}
                  title="Copy phone number"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1"
                >
                  <Icon name="copy" size={12} />
                  <span>Copy</span>
                </button>

                <a
                  href={`tel:${cleanPhone}`}
                  className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 text-xs font-semibold transition flex items-center gap-1"
                >
                  <Icon name="phone" size={12} />
                  <span>Call</span>
                </a>

                {cleanPhone.length >= 10 && (
                  <a
                    href={`https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold transition flex items-center gap-1"
                  >
                    <Icon name="chat" size={12} />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Location if provided */}
          {enquiry.location && (
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Icon name="pin" size={12} /> Preferred Location / Property
              </span>
              <div className="text-sm font-bold text-slate-800 pt-0.5">
                {enquiry.location}
              </div>
            </div>
          )}

          {/* Message Content */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="fileText" size={12} /> Message / Inquiry Content
            </span>

            {enquiry.message ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
                {enquiry.message}
              </div>
            ) : (
              <div className="text-xs text-slate-400 italic py-2">
                No custom message included with this callback request.
              </div>
            )}
          </div>

          {/* Submission Timestamps */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Received on: {createdFormatted}</span>
            <span className="font-mono text-slate-400">ID: {enquiry.id}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            >
              <Icon name="trash" size={13} />
              <span>Delete Lead</span>
            </button>
          ) : (
            <div />
          )}

          <Btn variant="dark" size="md" onClick={onClose}>
            Close
          </Btn>
        </div>
      </div>
    </div>
  );
}

