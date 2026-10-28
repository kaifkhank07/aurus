"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { useMasterStore } from "@/store/useMasterStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { SafeHostel, TenantType, RentFrequency, TENANT_TYPES, RENT_FREQUENCIES } from "@/types/hostel.types";
import { SafeLocality } from "@/types/locality.types";
import { getMediaUrl } from "@/lib/media";

export interface EditHostelProps {
  open: boolean;
  hostel: SafeHostel | null;
  onClose: () => void;
  onSuccess: () => void;
}

type HostelTab = "basic" | "location" | "pricing" | "media" | "seo";
const TABS: HostelTab[] = ["basic", "location", "pricing", "media", "seo"];

export default function EditHostel({ open, hostel, onClose, onSuccess }: EditHostelProps) {
  const { updateHostel } = useHostelAndEnquiryStore();
  const {
    cities,
    fetchCities,
    fetchLocalities,
    amenities,
    fetchAmenities,
  } = useMasterStore();

  // Basic Info
  const [title, setTitle] = useState(hostel?.title || "");
  const [subtitle, setSubtitle] = useState(hostel?.subtitle || "");
  const [tenantTypes, setTenantTypes] = useState<TenantType[]>(hostel?.tenantType || ["co-ed"]);
  const [isActive, setIsActive] = useState(hostel?.isActive ?? true);
  const [description, setDescription] = useState(hostel?.description || "");

  // Location
  const initialCityId = typeof hostel?.location?.city === "object" && hostel?.location?.city !== null
    ? (hostel.location.city as { id?: string }).id || ""
    : String(hostel?.location?.city || "");

  const initialLocalityId = typeof hostel?.location?.locality === "object" && hostel?.location?.locality !== null
    ? (hostel.location.locality as { id?: string }).id || ""
    : String(hostel?.location?.locality || "");

  const [cityId, setCityId] = useState(initialCityId);
  const [localityId, setLocalityId] = useState(initialLocalityId);
  const [address, setAddress] = useState(hostel?.location?.address || "");
  const [mapUrl, setMapUrl] = useState(hostel?.location?.mapUrl || "");
  const [latitude, setLatitude] = useState(
    hostel?.location?.latitude !== undefined ? String(hostel.location.latitude) : ""
  );
  const [longitude, setLongitude] = useState(
    hostel?.location?.longitude !== undefined ? String(hostel.location.longitude) : ""
  );

  // Pricing
  const [rent, setRent] = useState<number | "">(hostel?.rent ?? "");
  const [rentFrequency, setRentFrequency] = useState<RentFrequency>(hostel?.rentFrequency || "monthly");

  // Amenities
  const initialAmenities = (hostel?.amenities || []).map((a) =>
    typeof a === "object" && a !== null ? (a as { id?: string }).id || "" : String(a)
  ).filter(Boolean);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialAmenities);

  const existingFrontUrl = getMediaUrl(hostel?.frontImage?.url || hostel?.frontImage?.publickey);
  const existingFirstUrl = getMediaUrl(hostel?.firstImage?.url || hostel?.firstImage?.publickey);
  const existingSecondUrl = getMediaUrl(hostel?.secondImage?.url || hostel?.secondImage?.publickey);
  const existingBrochureUrl = getMediaUrl(hostel?.brochure?.url || hostel?.brochure?.publickey);

  // Replacement files
  const [newFrontFile, setNewFrontFile] = useState<File | null>(null);
  const [newFrontPreview, setNewFrontPreview] = useState<string | null>(null);

  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

  const [newFirstFile, setNewFirstFile] = useState<File | null>(null);
  const [newFirstPreview, setNewFirstPreview] = useState<string | null>(null);
  const [removeFirstImage, setRemoveFirstImage] = useState(false);

  const [newSecondFile, setNewSecondFile] = useState<File | null>(null);
  const [newSecondPreview, setNewSecondPreview] = useState<string | null>(null);
  const [removeSecondImage, setRemoveSecondImage] = useState(false);

  const [newBrochureFile, setNewBrochureFile] = useState<File | null>(null);
  const [removeBrochure, setRemoveBrochure] = useState(false);

  // SEO Metadata
  const [metaTitle, setMetaTitle] = useState(hostel?.metadata?.title || "");
  const [metaDescription, setMetaDescription] = useState(hostel?.metadata?.description || "");
  const [metaKeywordsInput, setMetaKeywordsInput] = useState(
    hostel?.metadata?.keywords?.join(", ") || ""
  );

  // Validation & Submission
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "location" | "pricing" | "media" | "seo">("basic");

  // Locality fetching & loading state
  const [cityLocalities, setCityLocalities] = useState<SafeLocality[]>([]);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(Boolean(initialCityId));
  const [localityFetchError, setLocalityFetchError] = useState<string | null>(null);

  // Fetch localities for a specific city on manual user change
  const loadLocalitiesForCity = useCallback(
    async (targetCityId: string) => {
      if (!targetCityId) {
        setCityLocalities([]);
        setIsLoadingLocalities(false);
        setLocalityFetchError(null);
        return;
      }

      setIsLoadingLocalities(true);
      setLocalityFetchError(null);

      try {
        const res = await fetchLocalities(
          { city: targetCityId, limit: 100, sortBy: "name", sortOrderDir: "asc" },
          true
        );
        if (res.success && res.data?.items) {
          const fetchedItems = [...res.data.items];

          const initialLocObj =
            typeof hostel?.location?.locality === "object" && hostel?.location?.locality !== null
              ? (hostel.location.locality as SafeLocality)
              : null;

          if (
            initialLocObj &&
            initialLocObj.id &&
            !fetchedItems.some((l) => l.id === initialLocObj.id) &&
            targetCityId === initialCityId
          ) {
            fetchedItems.unshift(initialLocObj);
          }

          setCityLocalities(fetchedItems);
        } else {
          setCityLocalities([]);
          setLocalityFetchError(res.message || "Failed to load localities for this city.");
        }
      } catch (err) {
        setCityLocalities([]);
        setLocalityFetchError(err instanceof Error ? err.message : "Failed to load localities.");
      } finally {
        setIsLoadingLocalities(false);
      }
    },
    [fetchLocalities, hostel, initialCityId]
  );

  // Load masters and initial localities on open
  useEffect(() => {
    if (!open) return;
    if (cities.length === 0) fetchCities({ limit: 100, sortBy: "city", sortOrderDir: "asc" });
    if (amenities.length === 0) fetchAmenities({ limit: 100 });

    if (initialCityId) {
      let isCancelled = false;
      fetchLocalities({ city: initialCityId, limit: 100, sortBy: "name", sortOrderDir: "asc" }, true)
        .then((res) => {
          if (isCancelled) return;
          if (res.success && res.data?.items) {
            const fetchedItems = [...res.data.items];
            const initialLocObj =
              typeof hostel?.location?.locality === "object" && hostel?.location?.locality !== null
                ? (hostel.location.locality as SafeLocality)
                : null;

            if (
              initialLocObj &&
              initialLocObj.id &&
              !fetchedItems.some((l) => l.id === initialLocObj.id)
            ) {
              fetchedItems.unshift(initialLocObj);
            }

            setCityLocalities(fetchedItems);
          } else {
            setCityLocalities([]);
            setLocalityFetchError(res.message || "Failed to load localities for this city.");
          }
        })
        .catch((err) => {
          if (isCancelled) return;
          setCityLocalities([]);
          setLocalityFetchError(err instanceof Error ? err.message : "Failed to load localities.");
        })
        .finally(() => {
          if (!isCancelled) {
            setIsLoadingLocalities(false);
          }
        });

      return () => {
        isCancelled = true;
      };
    }
  }, [open, cities.length, amenities.length, initialCityId, hostel, fetchCities, fetchAmenities, fetchLocalities]);

  useEffect(() => {
    return () => {
      if (newFrontPreview) URL.revokeObjectURL(newFrontPreview);
      if (newFirstPreview) URL.revokeObjectURL(newFirstPreview);
      if (newSecondPreview) URL.revokeObjectURL(newSecondPreview);
      newGalleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [newFrontPreview, newFirstPreview, newSecondPreview, newGalleryPreviews]);

  if (!open || !hostel) return null;

  const handleCityChange = (newCityId: string) => {
    setCityId(newCityId);
    setLocalityId("");
    if (clientErrors.city) {
      setClientErrors((p) => {
        const next = { ...p };
        delete next.city;
        return next;
      });
    }
    if (clientErrors.locality) {
      setClientErrors((p) => {
        const next = { ...p };
        delete next.locality;
        return next;
      });
    }
    loadLocalitiesForCity(newCityId);
  };

  const handleToggleTenantType = (type: TenantType) => {
    if (tenantTypes.includes(type)) {
      if (tenantTypes.length === 1) return;
      setTenantTypes(tenantTypes.filter((t) => t !== type));
    } else {
      setTenantTypes([...tenantTypes, type]);
    }
  };

  const handleToggleAmenity = (id: string) => {
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "Hostel title is required.";
    } else if (title.trim().length > 200) {
      errors.title = "Title cannot exceed 200 characters.";
    }

    if (tenantTypes.length === 0) {
      errors.tenantType = "At least one tenant type must be selected.";
    }

    if (!cityId) {
      errors.city = "City is required.";
    }

    if (!localityId) {
      errors.locality = "Locality is required.";
    }

    if (!address.trim()) {
      errors.address = "Address is required.";
    }

    if (rent === "" || Number(rent) < 0) {
      errors.rent = "Rent amount must be a positive number.";
    }

    if (!description.trim()) {
      errors.description = "Hostel description is required.";
    }

    const hasLat = latitude.trim() !== "";
    const hasLng = longitude.trim() !== "";
    if ((hasLat && !hasLng) || (!hasLat && hasLng)) {
      errors.coordinates = "Both latitude and longitude must be provided together, or omitted.";
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("subtitle", subtitle.trim());
    formData.append("tenantType", JSON.stringify(tenantTypes));
    formData.append("isActive", String(isActive));
    formData.append("description", description.trim());
    formData.append("rent", String(rent));
    formData.append("rentFrequency", rentFrequency);

    // Location
    const locationObj: Record<string, unknown> = {
      city: cityId,
      locality: localityId,
      address: address.trim(),
    };
    if (mapUrl.trim()) locationObj.mapUrl = mapUrl.trim();
    if (latitude.trim() && !isNaN(Number(latitude))) locationObj.latitude = Number(latitude);
    if (longitude.trim() && !isNaN(Number(longitude))) locationObj.longitude = Number(longitude);
    formData.append("location", JSON.stringify(locationObj));

    // Amenities
    formData.append("amenities", JSON.stringify(selectedAmenities));

    // Media replacements
    if (newFrontFile) {
      formData.append("frontImage", newFrontFile);
    }

    if (newFirstFile) {
      formData.append("firstImage", newFirstFile);
    } else if (removeFirstImage) {
      formData.append("firstImage", "null");
    }

    if (newSecondFile) {
      formData.append("secondImage", newSecondFile);
    } else if (removeSecondImage) {
      formData.append("secondImage", "null");
    }

    if (newBrochureFile) {
      formData.append("brochure", newBrochureFile);
    } else if (removeBrochure) {
      formData.append("brochure", "null");
    }

    newGalleryFiles.forEach((file) => {
      formData.append("galleryImages", file);
    });

    // SEO
    const keywords = metaKeywordsInput.split(",").map((k) => k.trim()).filter(Boolean);
    const metadata = {
      title: metaTitle.trim() || undefined,
      description: metaDescription.trim() || undefined,
      keywords: keywords.length > 0 ? keywords : undefined,
    };
    formData.append("metadata", JSON.stringify(metadata));

    const res = await updateHostel(hostel.id, formData);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setApiError(res.message || "Failed to update hostel property. Please try again.");
    }
  };

  const displayFrontUrl = newFrontPreview || existingFrontUrl;
  const displayFirstUrl = newFirstPreview || (!removeFirstImage ? existingFirstUrl : null);
  const displaySecondUrl = newSecondPreview || (!removeSecondImage ? existingSecondUrl : null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Icon name="pen" size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Edit Hostel Residence</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium truncate max-w-sm sm:max-w-md">
                Updating {hostel.title}
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
            <Icon name="x" size={15} />
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 bg-slate-50/30 overflow-x-auto shrink-0">
          {[
            { id: "basic", label: "Basic Info", icon: "fileText" },
            { id: "location", label: "Location", icon: "pin" },
            { id: "pricing", label: "Rent & Amenities", icon: "flow" },
            { id: "media", label: "Photos & Media", icon: "card" },
            { id: "seo", label: "SEO Metadata", icon: "flag" },
          ].map((tab) => {
            const isActiveTab = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${
                  isActiveTab
                    ? "border-orange-500 text-orange-600 bg-white shadow-2xs"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60"
                }`}
              >
                <Icon name={tab.icon} size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {apiError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2.5 shadow-2xs">
              <span className="text-rose-500 shrink-0 font-bold">!</span>
              <span className="leading-relaxed">{apiError}</span>
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === "basic" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <FormField label="Hostel Title *" error={clientErrors.title}>
                <TextInput
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Property title…"
                  error={!!clientErrors.title}
                  disabled={isSubmitting}
                  maxLength={200}
                />
              </FormField>

              <FormField label="Subtitle / Tagline (Optional)">
                <TextInput
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Short highlight tagline…"
                  disabled={isSubmitting}
                  maxLength={300}
                />
              </FormField>

              <FormField label="Tenant Category *" error={clientErrors.tenantType}>
                <div className="flex items-center gap-3 flex-wrap pt-1">
                  {TENANT_TYPES.map((type) => {
                    const isChecked = tenantTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleToggleTenantType(type)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-2 ${
                          isChecked
                            ? "bg-orange-500 text-white border-orange-600 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isChecked ? "bg-white" : "bg-slate-300"}`} />
                        <span className="capitalize">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </FormField>

              <FormField label="Hostel Description *" error={clientErrors.description}>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Full property description…"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all leading-relaxed"
                />
              </FormField>

              <label className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800">Active Listing</span>
                  <p className="text-[11px] text-slate-500">Property is visible to visitors on the website.</p>
                </div>
              </label>
            </div>
          )}

          {/* TAB 2: LOCATION */}
          {activeTab === "location" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="City *" error={clientErrors.city}>
                  <select
                    value={cityId}
                    onChange={(e) => handleCityChange(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 cursor-pointer"
                  >
                    <option value="">Select City…</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.city}, {c.state}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Locality / Area *"
                  hint={!cityId ? "Select a city first to view its localities." : undefined}
                  error={clientErrors.locality || localityFetchError || undefined}
                >
                  <div className="relative">
                    <select
                      value={localityId}
                      onChange={(e) => {
                        setLocalityId(e.target.value);
                        if (clientErrors.locality) {
                          setClientErrors((p) => {
                            const next = { ...p };
                            delete next.locality;
                            return next;
                          });
                        }
                      }}
                      disabled={!cityId || isLoadingLocalities || isSubmitting}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 cursor-pointer"
                    >
                      {!cityId ? (
                        <option value="">Select a city first…</option>
                      ) : isLoadingLocalities ? (
                        <option value="">Loading localities…</option>
                      ) : cityLocalities.length === 0 ? (
                        <option value="">No localities found for this city</option>
                      ) : (
                        <>
                          <option value="">Select Locality…</option>
                          {cityLocalities.map((loc) => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {isLoadingLocalities && (
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </FormField>
              </div>

              <FormField label="Street Address *" error={clientErrors.address}>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address…"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </FormField>

              <FormField label="Google Maps Link (Optional)">
                <TextInput
                  value={mapUrl}
                  onChange={(e) => setMapUrl(e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  disabled={isSubmitting}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Latitude (Optional)" error={clientErrors.coordinates}>
                  <TextInput
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="Latitude coordinate…"
                    disabled={isSubmitting}
                  />
                </FormField>
                <FormField label="Longitude (Optional)">
                  <TextInput
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="Longitude coordinate…"
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* TAB 3: PRICING & AMENITIES */}
          {activeTab === "pricing" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Rent Starting From (₹) *" error={clientErrors.rent}>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                      ₹
                    </span>
                    <TextInput
                      type="number"
                      min={0}
                      value={rent}
                      onChange={(e) => setRent(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 8500"
                      className="pl-8"
                      disabled={isSubmitting}
                    />
                  </div>
                </FormField>

                <FormField label="Rent Billing Cycle *">
                  <div className="flex items-center gap-2 pt-1">
                    {RENT_FREQUENCIES.map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setRentFrequency(freq)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer capitalize ${
                          rentFrequency === freq
                            ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </FormField>
              </div>

              {/* Amenities Multi-Select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Included Amenities ({selectedAmenities.length} Selected)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedAmenities.length === amenities.length) {
                        setSelectedAmenities([]);
                      } else {
                        setSelectedAmenities(amenities.map((a) => a.id));
                      }
                    }}
                    className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    {selectedAmenities.length === amenities.length ? "Deselect All" : "Select All"}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                  {amenities.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleToggleAmenity(amenity.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left cursor-pointer ${
                          isSelected
                            ? "bg-orange-50 border-orange-300 text-orange-950 font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                          isSelected ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300 bg-white"
                        }`}>
                          {isSelected && <span className="text-[9px]">✓</span>}
                        </span>
                        <span className="truncate">{amenity.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PHOTOS & MEDIA */}
          {activeTab === "media" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Front Cover Image */}
              <FormField
                label="Front Cover Image"
                hint="Replace or keep current cover photo."
                error={clientErrors.frontImage}
              >
                {displayFrontUrl ? (
                  <div className="relative w-full h-44 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={displayFrontUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    <label className="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm">
                      <Icon name="pen" size={12} />
                      <span>Change Cover Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setNewFrontFile(f);
                            setNewFrontPreview(URL.createObjectURL(f));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-orange-400 p-5 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer">
                    <Icon name="home" size={24} className="text-slate-400" />
                    <span className="text-xs font-bold text-orange-600">Upload Front Cover</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setNewFrontFile(f);
                          setNewFrontPreview(URL.createObjectURL(f));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </FormField>

              {/* Add More Gallery Images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Add New Gallery Photos
                  </label>
                  <label className="text-xs font-bold text-orange-600 hover:underline cursor-pointer flex items-center gap-1">
                    <Icon name="plus" size={12} />
                    <span>Upload Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) {
                          const validFiles = files.filter((f) => f.type.startsWith("image/"));
                          const urls = validFiles.map((f) => URL.createObjectURL(f));
                          setNewGalleryFiles((p) => [...p, ...validFiles]);
                          setNewGalleryPreviews((p) => [...p, ...urls]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {newGalleryPreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {newGalleryPreviews.map((url, idx) => (
                      <div key={url} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`New Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => {
                            URL.revokeObjectURL(url);
                            setNewGalleryFiles((p) => p.filter((_, i) => i !== idx));
                            setNewGalleryPreviews((p) => p.filter((_, i) => i !== idx));
                          }}
                          className="absolute inset-0 bg-black/50 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Room Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Room 1 */}
                <FormField label="Room View 1">
                  {displayFirstUrl ? (
                    <div className="relative h-28 rounded-xl border border-slate-200 overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={displayFirstUrl} alt="Room 1" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setNewFirstFile(null);
                          setNewFirstPreview(null);
                          setRemoveFirstImage(true);
                        }}
                        className="absolute inset-0 bg-black/50 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="h-28 border border-dashed border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center p-2">
                      <Icon name="bed" size={18} className="text-slate-400" />
                      <span className="text-[11px] font-semibold text-slate-600">Upload Room 1</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setNewFirstFile(f);
                            setNewFirstPreview(URL.createObjectURL(f));
                            setRemoveFirstImage(false);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </FormField>

                {/* Room 2 */}
                <FormField label="Room View 2">
                  {displaySecondUrl ? (
                    <div className="relative h-28 rounded-xl border border-slate-200 overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={displaySecondUrl} alt="Room 2" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setNewSecondFile(null);
                          setNewSecondPreview(null);
                          setRemoveSecondImage(true);
                        }}
                        className="absolute inset-0 bg-black/50 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="h-28 border border-dashed border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center p-2">
                      <Icon name="bed" size={18} className="text-slate-400" />
                      <span className="text-[11px] font-semibold text-slate-600">Upload Room 2</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setNewSecondFile(f);
                            setNewSecondPreview(URL.createObjectURL(f));
                            setRemoveSecondImage(false);
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </FormField>
              </div>

              {/* Brochure */}
              <FormField label="Property Brochure (PDF or Image)">
                {newBrochureFile ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 truncate">{newBrochureFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setNewBrochureFile(null)}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : existingBrochureUrl && !removeBrochure ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">Current Brochure Uploaded</span>
                    <button
                      type="button"
                      onClick={() => setRemoveBrochure(true)}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Remove Current
                    </button>
                  </div>
                ) : (
                  <label className="border border-dashed border-slate-200 hover:border-slate-300 p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                    <Icon name="fileText" size={15} className="text-slate-400" />
                    <span>Upload New Brochure</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setNewBrochureFile(f);
                          setRemoveBrochure(false);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </FormField>
            </div>
          )}

          {/* TAB 5: SEO METADATA */}
          {activeTab === "seo" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <FormField label="Meta Title">
                <TextInput
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Meta title…"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Meta Description">
                <TextInput
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Meta description…"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Meta Keywords">
                <TextInput
                  value={metaKeywordsInput}
                  onChange={(e) => setMetaKeywordsInput(e.target.value)}
                  placeholder="Keywords comma-separated…"
                  disabled={isSubmitting}
                />
              </FormField>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            {activeTab !== "basic" && (
              <button
                type="button"
                onClick={() => {
                  const prevIdx = TABS.indexOf(activeTab) - 1;
                  if (prevIdx >= 0) setActiveTab(TABS[prevIdx]);
                }}
                className="font-bold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1"
              >
                <span>← Previous Section</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Btn variant="ghost" size="md" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Btn>
            <Btn variant="brand" size="md" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin">
                    <Icon name="refresh" size={13} />
                  </span>
                  <span>Saving…</span>
                </>
              ) : (
                <>
                  <Icon name="check" size={13} />
                  <span>Save Changes</span>
                </>
              )}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
