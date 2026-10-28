"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { useMasterStore } from "@/store/useMasterStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { TenantType, RentFrequency, TENANT_TYPES, RENT_FREQUENCIES } from "@/types/hostel.types";
import { SafeLocality } from "@/types/locality.types";

export interface CreateHostelProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type HostelTab = "basic" | "location" | "pricing" | "media" | "seo";
const TABS: HostelTab[] = ["basic", "location", "pricing", "media", "seo"];

export default function CreateHostel({ open, onClose, onSuccess }: CreateHostelProps) {
  const { createHostel } = useHostelAndEnquiryStore();
  const {
    cities,
    fetchCities,
    fetchLocalities,
    amenities,
    fetchAmenities,
  } = useMasterStore();

  // Basic Details
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [tenantTypes, setTenantTypes] = useState<TenantType[]>(["co-ed"]);
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");

  // Location Details
  const [cityId, setCityId] = useState("");
  const [localityId, setLocalityId] = useState("");
  const [address, setAddress] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Pricing & Frequency
  const [rent, setRent] = useState<number | "">("");
  const [rentFrequency, setRentFrequency] = useState<RentFrequency>("monthly");

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Photos & Media
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [frontPreviewUrl, setFrontPreviewUrl] = useState<string | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);

  const [firstImageFile, setFirstImageFile] = useState<File | null>(null);
  const [firstPreviewUrl, setFirstPreviewUrl] = useState<string | null>(null);

  const [secondImageFile, setSecondImageFile] = useState<File | null>(null);
  const [secondPreviewUrl, setSecondPreviewUrl] = useState<string | null>(null);

  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [brochureName, setBrochureName] = useState<string | null>(null);

  // SEO Metadata
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywordsInput, setMetaKeywordsInput] = useState("");

  // Validation & Submission
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active form section tab
  const [activeTab, setActiveTab] = useState<"basic" | "location" | "pricing" | "media" | "seo">("basic");

  // Locality fetching & loading state
  const [cityLocalities, setCityLocalities] = useState<SafeLocality[]>([]);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(false);
  const [localityFetchError, setLocalityFetchError] = useState<string | null>(null);

  // Fetch localities for a specific city
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
          setCityLocalities(res.data.items);
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
    [fetchLocalities]
  );

  // Load master data on open
  useEffect(() => {
    if (open) {
      if (cities.length === 0) fetchCities({ limit: 100, sortBy: "city", sortOrderDir: "asc" });
      if (amenities.length === 0) fetchAmenities({ limit: 100 });
    }
  }, [open, cities.length, amenities.length, fetchCities, fetchAmenities]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (frontPreviewUrl) URL.revokeObjectURL(frontPreviewUrl);
      if (firstPreviewUrl) URL.revokeObjectURL(firstPreviewUrl);
      if (secondPreviewUrl) URL.revokeObjectURL(secondPreviewUrl);
      galleryPreviewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [frontPreviewUrl, firstPreviewUrl, secondPreviewUrl, galleryPreviewUrls]);

  if (!open) return null;

  const handleCityChange = (newCityId: string) => {
    setCityId(newCityId);
    setLocalityId(""); // Reset locality when city changes
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
      if (tenantTypes.length === 1) return; // Keep at least one
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

  const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setClientErrors((p) => ({ ...p, frontImage: "Only image files are allowed." }));
        return;
      }
      setClientErrors((p) => {
        const n = { ...p };
        delete n.frontImage;
        return n;
      });
      setFrontImageFile(file);
      setFrontPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter((f) => f.type.startsWith("image/"));
      const newUrls = validFiles.map((f) => URL.createObjectURL(f));
      setGalleryFiles((prev) => [...prev, ...validFiles]);
      setGalleryPreviewUrls((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    const urlToRemove = galleryPreviewUrls[index];
    if (urlToRemove) URL.revokeObjectURL(urlToRemove);
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviewUrls((prev) => prev.filter((_, i) => i !== index));
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

    if (!frontImageFile) {
      errors.frontImage = "Front cover image is required.";
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

    // Switch to tab with first error
    if (errors.title || errors.tenantType || errors.description) {
      setActiveTab("basic");
    } else if (errors.city || errors.locality || errors.address || errors.coordinates) {
      setActiveTab("location");
    } else if (errors.rent) {
      setActiveTab("pricing");
    } else if (errors.frontImage) {
      setActiveTab("media");
    }

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
    if (subtitle.trim()) formData.append("subtitle", subtitle.trim());
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
    if (selectedAmenities.length > 0) {
      formData.append("amenities", JSON.stringify(selectedAmenities));
    }

    // Media
    if (frontImageFile) formData.append("frontImage", frontImageFile);
    if (firstImageFile) formData.append("firstImage", firstImageFile);
    if (secondImageFile) formData.append("secondImage", secondImageFile);
    if (brochureFile) formData.append("brochure", brochureFile);
    galleryFiles.forEach((file) => {
      formData.append("galleryImages", file);
    });

    // SEO
    const keywords = metaKeywordsInput.split(",").map((k) => k.trim()).filter(Boolean);
    if (metaTitle.trim() || metaDescription.trim() || keywords.length > 0) {
      const metadata = {
        title: metaTitle.trim() || undefined,
        description: metaDescription.trim() || undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
      };
      formData.append("metadata", JSON.stringify(metadata));
    }

    const res = await createHostel(formData);
    setIsSubmitting(false);

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setApiError(res.message || "Failed to create hostel property. Please review errors and try again.");
    }
  };

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
              <Icon name="home" size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Add Hostel Residence</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Create a new property listing with room specs, amenities, and pricing.
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
              <FormField label="Hostel Title *" hint="Public name of the residence." error={clientErrors.title}>
                <TextInput
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Aurus Prime Co-Living for Students"
                  error={!!clientErrors.title}
                  disabled={isSubmitting}
                  maxLength={200}
                />
              </FormField>

              <FormField label="Subtitle / Tagline (Optional)" hint="Short punchy highlight on cards.">
                <TextInput
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Luxury PG near Koramangala Sony Signal"
                  disabled={isSubmitting}
                  maxLength={300}
                />
              </FormField>

              <FormField label="Tenant Category *" hint="Select who can stay at this residence." error={clientErrors.tenantType}>
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

              <FormField label="Hostel Description *" hint="Detailed overview of rooms, living spaces, and facilities." error={clientErrors.description}>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the property features, room types, food, cleanliness, and security…"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:ring-slate-400/20 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 transition-all leading-relaxed"
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
                  <p className="text-[11px] text-slate-500">Property will be immediately visible to prospective tenants on the website.</p>
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

              <FormField label="Complete Street Address *" error={clientErrors.address}>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. #14, 5th Cross, 6th Block, Koramangala, Landmark: Near Sony World Signal"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </FormField>

              <FormField label="Google Maps Link (Optional)" hint="Direct URL to location pin on Google Maps.">
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
                    placeholder="e.g. 12.9352"
                    disabled={isSubmitting}
                  />
                </FormField>
                <FormField label="Longitude (Optional)">
                  <TextInput
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="e.g. 77.6245"
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
                label="Front Cover Image *"
                hint="Main hero photo shown on listing cards (JPEG, PNG, WebP up to 10MB)."
                error={clientErrors.frontImage}
              >
                {frontPreviewUrl ? (
                  <div className="relative w-full h-44 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={frontPreviewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setFrontImageFile(null);
                        setFrontPreviewUrl(null);
                      }}
                      className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Icon name="x" size={12} />
                      <span>Remove</span>
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-orange-400 hover:bg-orange-50/20 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center">
                    <Icon name="home" size={24} className="text-slate-400" />
                    <span className="text-xs font-bold text-orange-600">Upload Front Cover Photo</span>
                    <input type="file" accept="image/*" onChange={handleFrontImageChange} className="hidden" />
                  </label>
                )}
              </FormField>

              {/* Gallery Images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Property Photo Gallery ({galleryFiles.length} Photos)
                  </label>
                  <label className="text-xs font-bold text-orange-600 hover:underline cursor-pointer flex items-center gap-1">
                    <Icon name="plus" size={12} />
                    <span>Add Photos</span>
                    <input type="file" accept="image/*" multiple onChange={handleGalleryFilesChange} className="hidden" />
                  </label>
                </div>

                {galleryPreviewUrls.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                    {galleryPreviewUrls.map((url, idx) => (
                      <div key={url} className="relative h-20 rounded-xl overflow-hidden border border-slate-200 group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute inset-0 bg-black/50 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No gallery photos added yet. Upload common areas, rooms, and dining photos.</p>
                )}
              </div>

              {/* Room Photos & Brochure Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* First Room Image */}
                <FormField label="Room View 1 (Optional)">
                  {firstPreviewUrl ? (
                    <div className="relative h-28 rounded-xl border border-slate-200 overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={firstPreviewUrl} alt="Room 1" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setFirstImageFile(null);
                          setFirstPreviewUrl(null);
                        }}
                        className="absolute inset-0 bg-black/50 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="h-28 border border-dashed border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center p-2">
                      <Icon name="bed" size={18} className="text-slate-400" />
                      <span className="text-[11px] font-semibold text-slate-600">Room Photo 1</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setFirstImageFile(f);
                            setFirstPreviewUrl(URL.createObjectURL(f));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </FormField>

                {/* Second Room Image */}
                <FormField label="Room View 2 (Optional)">
                  {secondPreviewUrl ? (
                    <div className="relative h-28 rounded-xl border border-slate-200 overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={secondPreviewUrl} alt="Room 2" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setSecondImageFile(null);
                          setSecondPreviewUrl(null);
                        }}
                        className="absolute inset-0 bg-black/50 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="h-28 border border-dashed border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition text-center p-2">
                      <Icon name="bed" size={18} className="text-slate-400" />
                      <span className="text-[11px] font-semibold text-slate-600">Room Photo 2</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setSecondImageFile(f);
                            setSecondPreviewUrl(URL.createObjectURL(f));
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  )}
                </FormField>
              </div>

              {/* Brochure File */}
              <FormField label="Property Brochure (PDF or Image, Optional)">
                {brochureName ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 truncate">{brochureName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setBrochureFile(null);
                        setBrochureName(null);
                      }}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="border border-dashed border-slate-200 hover:border-slate-300 p-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                    <Icon name="fileText" size={15} className="text-slate-400" />
                    <span>Upload PDF Brochure</span>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setBrochureFile(f);
                          setBrochureName(f.name);
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
              <FormField label="Meta Title" hint="Overrides page title for Google search indexing.">
                <TextInput
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="e.g. Aurus Koramangala - Luxury Co-Living & Student Hostel"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Meta Description" hint="Snippet shown beneath search engine results.">
                <TextInput
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Short description for Google search previews…"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Meta Keywords" hint="Comma-separated keywords for SEO indexing.">
                <TextInput
                  value={metaKeywordsInput}
                  onChange={(e) => setMetaKeywordsInput(e.target.value)}
                  placeholder="hostel bangalore, pg in koramangala, co-ed student living"
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

            {activeTab !== "seo" ? (
              <Btn
                variant="brand"
                size="md"
                onClick={() => {
                  const nextIdx = TABS.indexOf(activeTab) + 1;
                  if (nextIdx < TABS.length) setActiveTab(TABS[nextIdx]);
                }}
              >
                <span>Next Section →</span>
              </Btn>
            ) : null}

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
                  <span>Create Property</span>
                </>
              )}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
