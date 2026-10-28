"use client";

import React, { useState } from "react";
import { SafeHostel } from "@/types/hostel.types";
import { SafeAmenity } from "@/types/amenity.types";
import { Chip, Btn } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { getMediaUrl } from "@/lib/media";

export interface HostelDetailsProps {
  open: boolean;
  hostel: SafeHostel | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function HostelDetails({
  open,
  hostel,
  onClose,
  onEdit,
  onDelete,
}: HostelDetailsProps) {
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  if (!open || !hostel) return null;

  const frontImageUrl = getMediaUrl(hostel.frontImage?.url || hostel.frontImage?.publickey);
  const firstImageUrl = getMediaUrl(hostel.firstImage?.url || hostel.firstImage?.publickey);
  const secondImageUrl = getMediaUrl(hostel.secondImage?.url || hostel.secondImage?.publickey);
  const brochureUrl = getMediaUrl(hostel.brochure?.url || hostel.brochure?.publickey);

  const galleryUrls = (hostel.galleryImages || [])
    .map((img) => getMediaUrl(img.url || img.publickey))
    .filter(Boolean) as string[];

  const allPhotos = [
    ...(frontImageUrl ? [{ url: frontImageUrl, label: "Front Cover" }] : []),
    ...(firstImageUrl ? [{ url: firstImageUrl, label: "Room View 1" }] : []),
    ...(secondImageUrl ? [{ url: secondImageUrl, label: "Room View 2" }] : []),
    ...galleryUrls.map((u, i) => ({ url: u, label: `Gallery ${i + 1}` })),
  ];

  const handleCopySlug = () => {
    navigator.clipboard.writeText(`/hostels/${hostel.slug}`);
    setCopiedSlug(true);
    setTimeout(() => {
      setCopiedSlug(false);
    }, 2000);
  };

  const cityName =
    typeof hostel.location?.city === "object" && hostel.location?.city !== null
      ? (hostel.location.city as { city?: string }).city || ""
      : String(hostel.location?.city || "—");

  const localityName =
    typeof hostel.location?.locality === "object" && hostel.location?.locality !== null
      ? (hostel.location.locality as { name?: string }).name || ""
      : String(hostel.location?.locality || "—");

  const formattedRent = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(hostel.rent);

  const createdFormatted = hostel.createdAt
    ? new Date(hostel.createdAt).toLocaleDateString("en-US", {
        month: "short",
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
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200">
        {/* Banner Hero */}
        <div className="relative w-full h-64 bg-slate-900 shrink-0 overflow-hidden">
          {frontImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activePhoto || frontImageUrl}
              alt={hostel.title}
              className="w-full h-full object-cover transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-500">
              <Icon name="home" size={48} />
            </div>
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-xs z-10"
            aria-label="Close"
          >
            <Icon name="x" size={15} />
          </button>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />

          {/* Banner Bottom Badges & Rent */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3 text-white">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Chip tone={hostel.isActive ? "mint" : "rose"} dot>
                  {hostel.isActive ? "Active Listing" : "Inactive"}
                </Chip>
                {hostel.tenantType.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-xs text-white uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate drop-shadow-md">
                {hostel.title}
              </h2>
            </div>

            <div className="shrink-0 text-right bg-slate-900/80 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starts From</div>
              <div className="text-lg sm:text-xl font-extrabold text-orange-400">
                {formattedRent}
                <span className="text-xs text-slate-300 font-normal"> / {hostel.rentFrequency === "monthly" ? "mo" : "yr"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Subtitle & Slug bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-500">Public Slug:</span>
              <span className="font-mono text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                /hostels/{hostel.slug}
              </span>
              <button
                type="button"
                onClick={handleCopySlug}
                title="Copy slug link"
                className="text-slate-400 hover:text-slate-700 p-1 rounded transition cursor-pointer"
              >
                {copiedSlug ? (
                  <span className="text-emerald-600 font-bold text-[11px]">Copied!</span>
                ) : (
                  <Icon name="copy" size={13} />
                )}
              </button>
            </div>

            <div className="text-slate-400 font-medium text-[11px]">
              Listed on: {createdFormatted}
            </div>
          </div>

          {/* Photo Gallery Selector */}
          {allPhotos.length > 1 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Property Photos ({allPhotos.length})
                </span>
                {activePhoto && (
                  <button
                    type="button"
                    onClick={() => setActivePhoto(null)}
                    className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                  >
                    Reset Hero Image
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {allPhotos.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhoto(p.url)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                      (activePhoto || frontImageUrl) === p.url
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location & Address Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Icon name="pin" size={12} /> Residence Address & Neighborhood
              </span>

              {hostel.location?.mapUrl && (
                <a
                  href={hostel.location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                >
                  <span>Open on Google Maps ↗</span>
                </a>
              )}
            </div>

            <div className="text-sm font-bold text-slate-900">
              {localityName}, {cityName}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {hostel.location?.address}
            </p>
          </div>

          {/* Included Amenities */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="flow" size={12} /> Included Amenities ({hostel.amenities?.length || 0})
            </span>
            {hostel.amenities && hostel.amenities.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hostel.amenities.map((amenity, idx) => {
                  const name =
                    typeof amenity === "object" && amenity !== null
                      ? (amenity as SafeAmenity).name
                      : String(amenity);
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2 text-xs font-semibold text-slate-800"
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span className="truncate">{name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No amenities specified.</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="fileText" size={12} /> Property Description
            </span>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
              {hostel.description}
            </div>
          </div>

          {/* Brochure if present */}
          {brochureUrl && (
            <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="fileText" size={16} className="text-orange-600" />
                <span className="text-xs font-bold text-orange-950">Property Brochure & Rules Document</span>
              </div>
              <a
                href={brochureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition"
              >
                Download Brochure ↗
              </a>
            </div>
          )}

          {/* SEO Metadata Card */}
          {hostel.metadata && (hostel.metadata.title || hostel.metadata.description || hostel.metadata.keywords?.length) && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
              <h4 className="font-bold text-slate-700 flex items-center gap-1.5">
                <Icon name="flag" size={12} className="text-slate-400" />
                <span>Search Engine Preview (SEO)</span>
              </h4>
              {hostel.metadata.title && (
                <div className="text-sky-700 font-bold">{hostel.metadata.title}</div>
              )}
              {hostel.metadata.description && (
                <p className="text-slate-600">{hostel.metadata.description}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <Icon name="trash" size={13} />
                <span>Delete Property</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <Btn variant="brand" size="md" onClick={onEdit}>
                <Icon name="pen" size={13} />
                <span>Edit Property</span>
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

