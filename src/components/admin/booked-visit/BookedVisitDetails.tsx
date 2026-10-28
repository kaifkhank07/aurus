"use client";

import React, { useState } from "react";
import { SafeBookedVisit } from "@/types/booked-visit.types";
import { Chip, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface BookedVisitDetailsProps {
  open: boolean;
  visit: SafeBookedVisit | null;
  onClose: () => void;
  onDelete?: () => void;
}

export default function BookedVisitDetails({
  open,
  visit,
  onClose,
  onDelete,
}: BookedVisitDetailsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!open || !visit) return null;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  // Date parsing & upcoming/past calculation
  const visitDateObj = visit.preferredDate ? new Date(visit.preferredDate) : null;
  const isDateValid = visitDateObj && !isNaN(visitDateObj.getTime());

  const formattedVisitDate = isDateValid
    ? visitDateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : visit.preferredDate || "Not specified";

  const isUpcoming = isDateValid
    ? new Date(visitDateObj.toDateString()) >= new Date(new Date().toDateString())
    : false;

  const createdFormatted = visit.createdAt
    ? new Date(visit.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

  const cleanPhone = visit.number.replace(/\D/g, "");

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
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-sky-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Icon name="calendar" size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Visit Appointment Details
                </h3>
                <Chip tone={isUpcoming ? "mint" : "slate"} dot>
                  {isUpcoming ? "Upcoming" : "Past Appointment"}
                </Chip>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Appointment ID: <span className="font-mono text-slate-700">{visit.id.slice(-8)}</span>
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
          {/* Visitor Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-sm shrink-0">
                {visit.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 leading-tight">
                  {visit.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-slate-500 font-medium">Role / Profile:</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-slate-200 text-slate-700">
                    {visit.iam || "Visitor"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 gap-3">
            {/* Phone & Communication */}
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
                  {visit.number}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopy(visit.number, "phone")}
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
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Preferred Date */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Icon name="calendar" size={12} /> Scheduled Date
              </span>
              <div className="text-sm font-bold text-slate-800 pt-0.5">
                {formattedVisitDate}
              </div>
            </div>

            {/* Preferred Time */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Icon name="clock" size={12} /> Preferred Time
              </span>
              <div className="text-sm font-bold text-slate-800 pt-0.5">
                {visit.preferredTime || "Any Time"}
              </div>
            </div>
          </div>

          {/* Location / Property */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="pin" size={12} /> Target Residence / Property Location
            </span>
            <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              <span>{visit.location || "General Property Visit"}</span>
            </div>
          </div>

          {/* Submission Timestamps */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Submitted on: {createdFormatted}</span>
            <span className="font-mono text-slate-400">ID: {visit.id}</span>
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

