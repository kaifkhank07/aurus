"use client";

import React from "react";
import { SafeStory } from "@/types/story.types";
import { getMediaUrl } from "@/lib/media";
import { Chip, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface StoryDetailsProps {
  open: boolean;
  story: SafeStory | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function StoryDetails({
  open,
  story,
  onClose,
  onEdit,
  onDelete,
}: StoryDetailsProps) {
  if (!open || !story) return null;

  const imageUrl = getMediaUrl(story.image?.url || story.image?.publickey);

  const createdFormatted = story.createdAt
    ? new Date(story.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    : "—";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-amber-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Icon name="star" size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Resident Story
                </h3>
                {story.isFeatured && (
                  <Chip tone="amber">
                    ★ Featured
                  </Chip>
                )}
                <Chip tone={story.isActive ? "mint" : "rose"} dot>
                  {story.isActive ? "Active" : "Inactive"}
                </Chip>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Story ID: <span className="font-mono text-slate-700">{story.id.slice(-8)}</span>
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
          {/* Resident Overview Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-2xs">
              {story.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-base font-bold text-slate-900 leading-tight truncate">
                {story.name}
              </h4>
              <p className="text-xs text-slate-600 font-medium mt-0.5 truncate">
                {story.profession}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                <Icon name="pin" size={11} className="text-slate-400 shrink-0" />
                <span className="truncate">{story.location}</span>
              </div>
            </div>
          </div>

          {/* Background / Side Section Card Image */}
          {imageUrl ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="card" size={12} /> Background / Side Card Banner
                </span>
                {story.isFeatured && (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    ★ Featured Banner
                  </span>
                )}
              </div>
              <div className="relative w-full h-44 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`${story.name} background`}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-[1.01]"
                />
                {/* <a
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-semibold backdrop-blur-xs flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <Icon name="eye" size={11} />
                  <span>View Full</span>
                </a> */}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Icon name="card" size={13} />
                <span>Background / Side Card Image</span>
              </span>
              <span className="text-[11px] text-slate-400 italic">None attached (Standard Story)</span>
            </div>
          )}

          {/* Star Rating Display */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Rating Awarded
            </span>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400 text-base">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={s <= story.rating ? "text-amber-400" : "text-slate-200"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                {story.rating}.0 / 5.0
              </span>
            </div>
          </div>

          {/* Testimonial Quote */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="chat" size={12} /> Testimonial Feedback
            </span>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-sm text-slate-800 leading-relaxed italic relative">
              <span className="text-2xl text-slate-300 font-serif leading-none absolute top-2 left-2">&ldquo;</span>
              <p className="relative z-10 pl-3 select-text whitespace-pre-wrap">{story.description}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Published on: {createdFormatted}</span>
            <span className="font-mono text-slate-400">ID: {story.id}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="trash" size={13} />
                <span>Delete Story</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Btn variant="brand" size="md" onClick={onEdit}>
                <Icon name="pen" size={13} />
                <span>Edit Story</span>
              </Btn>
            )}
            <Btn variant="ghost" size="md" onClick={onClose}>
              Close
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

