"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { useMasterStore } from "@/store/useMasterStore";
import { Btn, FormField, TextInput } from "../ui/AdminUI";
import RichTextEditor, { isQuillEmpty } from "../ui/RichTextEditor";
import Icon from "../ui/AdminIcons";
import { SafeHostel, TenantType, TENANT_TYPES } from "@/types/hostel.types";
import { SafeLocality } from "@/types/locality.types";
import { SafeInstitute } from "@/types/institute.types";
import { getMediaUrl } from "@/lib/media";

export interface EditHostelProps {
  open: boolean;
  hostel: SafeHostel | null;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "dialog" | "page";
}

type HostelTab = "basic" | "location" | "pricing" | "media" | "seo";

function extractIds(arr: unknown[] | undefined): string[] {
  return (arr || [])
    .map((item) =>
      typeof item === "object" && item !== null
        ? (item as { id?: string; _id?: string }).id || (item as { id?: string; _id?: string })._id || ""
        : String(item)
    )
    .filter(Boolean);
}

export default function EditHostel({
  open,
  hostel,
  onClose,
  onSuccess,
  mode = "dialog",
}: EditHostelProps) {
  const { updateHostel } = useHostelAndEnquiryStore();
  const {
    cities,
    fetchCities,
    fetchLocalities,
    amenities,
    fetchAmenities,
    occupancies,
    fetchOccupancies,
    rooms,
    fetchRooms,
    services,
    fetchServices,
    institutes,
    fetchInstitutes,
    rentFrequencies,
    fetchRentFrequencies,
  } = useMasterStore();

  // Basic Info
  const [title, setTitle] = useState(hostel?.title || "");
  const [subtitle, setSubtitle] = useState(hostel?.subtitle || "");

  const initialTenantType: TenantType =
    typeof hostel?.tenantType === "string"
      ? (hostel.tenantType as TenantType)
      : Array.isArray(hostel?.tenantType) && (hostel.tenantType as string[]).length > 0
        ? ((hostel.tenantType as string[])[0] as TenantType)
        : "co-ed";

  const [tenantType, setTenantType] = useState<TenantType>(initialTenantType);
  const [isActive, setIsActive] = useState(hostel?.isActive ?? true);
  const [description, setDescription] = useState(hostel?.description || "");

  // Rating Info
  const [ratingStar, setRatingStar] = useState<number | "">(
    hostel?.rating?.star !== undefined ? hostel.rating.star : ""
  );
  const [ratingUserCount, setRatingUserCount] = useState<number | "">(
    hostel?.rating?.userCount !== undefined ? hostel.rating.userCount : ""
  );

  // Location
  const initialCityId =
    typeof hostel?.location?.city === "object" && hostel?.location?.city !== null
      ? (hostel.location.city as { id?: string }).id || ""
      : String(hostel?.location?.city || "");

  const initialLocalityId =
    typeof hostel?.location?.locality === "object" && hostel?.location?.locality !== null
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

  // Pricing (Amount & Frequency Master)
  const initialRentAmount =
    typeof hostel?.rent === "object" && hostel?.rent !== null
      ? hostel.rent.amount
      : typeof (hostel as unknown as { rent?: number })?.rent === "number"
        ? ((hostel as unknown as { rent?: number }).rent as number)
        : "";

  const initialRentFreqId =
    typeof hostel?.rent?.frequency === "object" && hostel?.rent?.frequency !== null
      ? (hostel.rent.frequency as { id?: string }).id || ""
      : typeof hostel?.rent?.frequency === "string"
        ? hostel.rent.frequency
        : "";

  const [rentAmount, setRentAmount] = useState<number | "">(initialRentAmount);
  const [rentFrequencyId, setRentFrequencyId] = useState(initialRentFreqId);

  // Master References
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(extractIds(hostel?.amenities));
  const [selectedOccupancies, setSelectedOccupancies] = useState<string[]>(extractIds(hostel?.occupancy));
  const [selectedRooms, setSelectedRooms] = useState<string[]>(extractIds(hostel?.room));
  const [selectedServices, setSelectedServices] = useState<string[]>(extractIds(hostel?.services));
  const [selectedInstitutes, setSelectedInstitutes] = useState<string[]>(extractIds(hostel?.institute));

  // Media
  const existingFrontUrl = getMediaUrl(hostel?.frontImage?.url || hostel?.frontImage?.publickey);
  const existingBrochureUrl = getMediaUrl(hostel?.brochure?.url || hostel?.brochure?.publickey);

  const [newFrontFile, setNewFrontFile] = useState<File | null>(null);
  const [newFrontPreview, setNewFrontPreview] = useState<string | null>(null);

  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [newGalleryPreviews, setNewGalleryPreviews] = useState<string[]>([]);

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
  const [activeTab, setActiveTab] = useState<HostelTab>("basic");

  // Locality fetching & loading state
  const [cityLocalities, setCityLocalities] = useState<SafeLocality[]>([]);
  const [isLoadingLocalities, setIsLoadingLocalities] = useState(Boolean(initialCityId));
  const [localityFetchError, setLocalityFetchError] = useState<string | null>(null);

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
    [fetchLocalities, hostel?.location?.locality, initialCityId]
  );

  // Institute fetching & loading state (dependent on selected city)
  const [cityInstitutes, setCityInstitutes] = useState<SafeInstitute[]>([]);
  const [isLoadingInstitutes, setIsLoadingInstitutes] = useState(Boolean(initialCityId));
  const [instituteFetchError, setInstituteFetchError] = useState<string | null>(null);

  const loadInstitutesForCity = useCallback(
    async (targetCityId: string) => {
      if (!targetCityId) {
        setCityInstitutes([]);
        setIsLoadingInstitutes(false);
        setInstituteFetchError(null);
        return;
      }

      setIsLoadingInstitutes(true);
      setInstituteFetchError(null);

      try {
        const res = await fetchInstitutes(
          { city: targetCityId, limit: 100, sortBy: "name", sortOrderDir: "asc" },
          true
        );
        if (res.success && res.data?.items) {
          const fetchedItems = [...res.data.items];
          // If viewing initial city, make sure existing selected institute objects are preserved in options
          if (Array.isArray(hostel?.institute) && targetCityId === initialCityId) {
            hostel.institute.forEach((rawInst) => {
              if (typeof rawInst === "object" && rawInst !== null && "id" in rawInst) {
                const instObj = rawInst as SafeInstitute;
                if (!fetchedItems.some((i) => i.id === instObj.id)) {
                  fetchedItems.push(instObj);
                }
              }
            });
          }
          setCityInstitutes(fetchedItems);
        } else {
          setCityInstitutes([]);
          setInstituteFetchError(res.message || "Failed to load institutes for this city.");
        }
      } catch (err) {
        setCityInstitutes([]);
        setInstituteFetchError(err instanceof Error ? err.message : "Failed to load institutes.");
      } finally {
        setIsLoadingInstitutes(false);
      }
    },
    [fetchInstitutes, hostel?.institute, initialCityId]
  );

  useEffect(() => {
    if (open) {
      if (cities.length === 0) fetchCities({ limit: 100, sortBy: "city", sortOrderDir: "asc" });
      if (amenities.length === 0) fetchAmenities({ limit: 100 });
      if (occupancies.length === 0) fetchOccupancies({ limit: 100 });
      if (rooms.length === 0) fetchRooms({ limit: 100 });
      if (services.length === 0) fetchServices({ limit: 100 });
      if (rentFrequencies.length === 0) fetchRentFrequencies({ limit: 100 });

      if (initialCityId) {
        loadLocalitiesForCity(initialCityId);
        loadInstitutesForCity(initialCityId);
      }
    }
  }, [
    open,
    cities.length,
    amenities.length,
    occupancies.length,
    rooms.length,
    services.length,
    rentFrequencies.length,
    initialCityId,
    fetchCities,
    fetchAmenities,
    fetchOccupancies,
    fetchRooms,
    fetchServices,
    fetchRentFrequencies,
    loadLocalitiesForCity,
    loadInstitutesForCity,
  ]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (newFrontPreview) URL.revokeObjectURL(newFrontPreview);
      newGalleryPreviews.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [newFrontPreview, newGalleryPreviews]);

  if (!open || !hostel) return null;

  const handleCityChange = (newCityId: string) => {
    setCityId(newCityId);
    setLocalityId("");
    if (newCityId === initialCityId) {
      setSelectedInstitutes(extractIds(hostel?.institute));
    } else {
      setSelectedInstitutes([]);
    }
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
    loadInstitutesForCity(newCityId);
  };

  const handleToggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleToggleOccupancy = (id: string) => {
    setSelectedOccupancies((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const handleToggleRoom = (id: string) => {
    setSelectedRooms((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleToggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleToggleInstitute = (id: string) => {
    setSelectedInstitutes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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
      setNewFrontFile(file);
      setNewFrontPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const validFiles = files.filter((f) => f.type.startsWith("image/"));
      const newUrls = validFiles.map((f) => URL.createObjectURL(f));
      setNewGalleryFiles((prev) => [...prev, ...validFiles]);
      setNewGalleryPreviews((prev) => [...prev, ...newUrls]);
    }
  };

  const handleRemoveNewGalleryImage = (index: number) => {
    const urlToRemove = newGalleryPreviews[index];
    if (urlToRemove) URL.revokeObjectURL(urlToRemove);
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setNewGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (!title.trim()) {
      errors.title = "Hostel title cannot be empty.";
    } else if (title.trim().length > 200) {
      errors.title = "Title cannot exceed 200 characters.";
    }

    if (!tenantType) {
      errors.tenantType = "Tenant category is required.";
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

    if (rentAmount === "" || Number(rentAmount) < 0) {
      errors.rent = "Rent amount must be a positive number.";
    }

    if (!rentFrequencyId) {
      errors.rentFrequency = "Please select a rent billing cycle.";
    }

    if (isQuillEmpty(description)) {
      errors.description = "Hostel description is required.";
    }

    const hasLat = latitude.trim() !== "";
    const hasLng = longitude.trim() !== "";
    if ((hasLat && !hasLng) || (!hasLat && hasLng)) {
      errors.coordinates = "Both latitude and longitude must be provided together, or omitted.";
    }

    setClientErrors(errors);

    if (errors.title || errors.tenantType || errors.description) {
      setActiveTab("basic");
    } else if (errors.city || errors.locality || errors.address || errors.coordinates) {
      setActiveTab("location");
    } else if (errors.rent || errors.rentFrequency) {
      setActiveTab("pricing");
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
    formData.append("subtitle", subtitle.trim());
    formData.append("tenantType", tenantType);
    formData.append("isActive", String(isActive));
    formData.append("description", description.trim());

    // Rent Object
    const rentPayload = {
      amount: Number(rentAmount),
      frequency: rentFrequencyId,
    };
    formData.append("rent", JSON.stringify(rentPayload));

    // Rating Object
    const ratingPayload = {
      star: ratingStar !== "" ? Number(ratingStar) : 0,
      userCount: ratingUserCount !== "" ? Number(ratingUserCount) : 0,
    };
    formData.append("rating", JSON.stringify(ratingPayload));

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

    // Master Reference Collections
    formData.append("amenities", JSON.stringify(selectedAmenities));
    formData.append("occupancy", JSON.stringify(selectedOccupancies));
    formData.append("room", JSON.stringify(selectedRooms));
    formData.append("services", JSON.stringify(selectedServices));
    formData.append("institute", JSON.stringify(selectedInstitutes));

    // Media
    if (newFrontFile) formData.append("frontImage", newFrontFile);
    if (newBrochureFile) formData.append("brochure", newBrochureFile);
    if (removeBrochure) formData.append("brochure", "null");

    newGalleryFiles.forEach((file) => {
      formData.append("galleryImages", file);
    });

    // SEO Metadata
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
      setApiError(res.message || "Failed to update hostel residence. Please try again.");
    }
  };

  const isPage = mode === "page";

  return (
    <div
      className={
        isPage
          ? "w-full space-y-4 mx-auto pb-10"
          : "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      }
      onMouseDown={
        isPage
          ? undefined
          : (e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              onClose();
            }
          }
      }
    >
      {isPage && (
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <Icon name="chevLeft" size={14} />
            <span>Back to Hostels</span>
          </button>
        </div>
      )}

      <div
        className={
          isPage
            ? "w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
            : "w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto animate-in zoom-in-95 duration-200"
        }
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <Icon name="pen" size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Edit Hostel Residence</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium truncate max-w-md">
                Updating {hostel.title}
              </p>
            </div>
          </div>

          {!isPage && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Close"
            >
              <Icon name="x" size={15} />
            </button>
          )}
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 bg-slate-50/30 overflow-x-auto shrink-0">
          {[
            { id: "basic", label: "Basic Info", icon: "fileText" },
            { id: "location", label: "Location", icon: "pin" },
            { id: "pricing", label: "Rent & Masters", icon: "flow" },
            { id: "media", label: "Photos & Media", icon: "card" },
            { id: "seo", label: "SEO Metadata", icon: "flag" },
          ].map((tab) => {
            const isActiveTab = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-2.5 rounded-t-xl text-xs font-bold transition-all flex items-center gap-2 border-b-2 cursor-pointer whitespace-nowrap ${isActiveTab
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

              {/* Tenant Category - Single Selection */}
              <FormField label="Tenant Category *" hint="Select who can stay at this residence (Single Choice)." error={clientErrors.tenantType}>
                <div className="flex items-center gap-3 flex-wrap pt-1">
                  {TENANT_TYPES.map((type) => {
                    const isSelected = tenantType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTenantType(type)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-2 ${isSelected
                            ? "bg-orange-500 text-white border-orange-600 shadow-2xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                      >
                        <span className={`w-2.5 h-2.5 rounded-full border ${isSelected ? "bg-white border-white" : "bg-slate-200 border-slate-300"}`} />
                        <span className="capitalize">{type}</span>
                      </button>
                    );
                  })}
                </div>
              </FormField>

              {/* Rating: Star & Reviews Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Rating Stars (0 to 5)" hint="e.g. 4.9">
                  <TextInput
                    type="number"
                    step="0.1"
                    min={0}
                    max={5}
                    value={ratingStar}
                    onChange={(e) => setRatingStar(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 4.9"
                    disabled={isSubmitting}
                  />
                </FormField>

                <FormField label="User / Review Count" hint="e.g. 48 reviews">
                  <TextInput
                    type="number"
                    min={0}
                    value={ratingUserCount}
                    onChange={(e) => setRatingUserCount(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 48"
                    disabled={isSubmitting}
                  />
                </FormField>
              </div>

              <FormField label="Description *" hint="Comprehensive overview of rooms, environment, and rules." error={clientErrors.description}>
                <RichTextEditor
                  value={description}
                  onChange={setDescription}
                  placeholder="Describe the rooms, food, security, and student lifestyle in detail…"
                  disabled={isSubmitting}
                  error={!!clientErrors.description}
                  minHeight="220px"
                />
              </FormField>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <input
                  type="checkbox"
                  id="edit-hostel-isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={isSubmitting}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 transition cursor-pointer"
                />
                <label
                  htmlFor="edit-hostel-isActive"
                  className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
                >
                  Active and visible to students on the public website
                </label>
              </div>
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
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 cursor-pointer"
                  >
                    <option value="">Select City…</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.city}, {city.state}
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

          {/* TAB 3: PRICING & MASTERS */}
          {activeTab === "pricing" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Rent Details (Amount & Frequency Master) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Rent Starting From (₹) *" error={clientErrors.rent}>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                      ₹
                    </span>
                    <TextInput
                      type="number"
                      min={0}
                      value={rentAmount}
                      onChange={(e) => setRentAmount(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 8500"
                      className="pl-8"
                      disabled={isSubmitting}
                    />
                  </div>
                </FormField>

                <FormField label="Rent Frequency Cycle *" error={clientErrors.rentFrequency}>
                  <select
                    value={rentFrequencyId}
                    onChange={(e) => {
                      setRentFrequencyId(e.target.value);
                      if (clientErrors.rentFrequency) {
                        setClientErrors((p) => {
                          const n = { ...p };
                          delete n.rentFrequency;
                          return n;
                        });
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-50 cursor-pointer"
                  >
                    <option value="">Select Rent Frequency…</option>
                    {rentFrequencies.map((freq) => (
                      <option key={freq.id} value={freq.id}>
                        {freq.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* Occupancies Multi-Select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Occupancy Options ({selectedOccupancies.length} Selected)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedOccupancies.length === occupancies.length) {
                        setSelectedOccupancies([]);
                      } else {
                        setSelectedOccupancies(occupancies.map((o) => o.id));
                      }
                    }}
                    className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    {selectedOccupancies.length === occupancies.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {occupancies.map((occ) => {
                    const isSelected = selectedOccupancies.includes(occ.id);
                    return (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => handleToggleOccupancy(occ.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left cursor-pointer ${isSelected
                            ? "bg-orange-50 border-orange-300 text-orange-950 font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${isSelected ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300 bg-white"
                          }`}>
                          {isSelected && <span className="text-[9px]">✓</span>}
                        </span>
                        <span className="truncate">{occ.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Room Configurations Multi-Select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Room Configurations ({selectedRooms.length} Selected)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedRooms.length === rooms.length) {
                        setSelectedRooms([]);
                      } else {
                        setSelectedRooms(rooms.map((r) => r.id));
                      }
                    }}
                    className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    {selectedRooms.length === rooms.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {rooms.map((room) => {
                    const isSelected = selectedRooms.includes(room.id);
                    return (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => handleToggleRoom(room.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left cursor-pointer ${isSelected
                            ? "bg-orange-50 border-orange-300 text-orange-950 font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${isSelected ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300 bg-white"
                          }`}>
                          {isSelected && <span className="text-[9px]">✓</span>}
                        </span>
                        <span className="truncate">{room.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Services Multi-Select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Services Provided ({selectedServices.length} Selected)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedServices.length === services.length) {
                        setSelectedServices([]);
                      } else {
                        setSelectedServices(services.map((s) => s.id));
                      }
                    }}
                    className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    {selectedServices.length === services.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {services.map((serv) => {
                    const isSelected = selectedServices.includes(serv.id);
                    return (
                      <button
                        key={serv.id}
                        type="button"
                        onClick={() => handleToggleService(serv.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left cursor-pointer ${isSelected
                            ? "bg-orange-50 border-orange-300 text-orange-950 font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${isSelected ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300 bg-white"
                          }`}>
                          {isSelected && <span className="text-[9px]">✓</span>}
                        </span>
                        <span className="truncate">{serv.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nearby Institutes Multi-Select (dependent on selected city) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nearby Institutes ({selectedInstitutes.length} Selected)
                  </label>
                  {cityInstitutes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedInstitutes.length === cityInstitutes.length) {
                          setSelectedInstitutes([]);
                        } else {
                          setSelectedInstitutes(cityInstitutes.map((i) => i.id));
                        }
                      }}
                      className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      {selectedInstitutes.length === cityInstitutes.length ? "Deselect All" : "Select All"}
                    </button>
                  )}
                </div>

                {!cityId ? (
                  <p className="text-xs text-slate-400 italic p-3 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                    Please select a city first in the Location tab to view nearby institutes.
                  </p>
                ) : isLoadingInstitutes ? (
                  <div className="flex items-center justify-center gap-2 p-3 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
                    <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span>Loading institutes for selected city…</span>
                  </div>
                ) : instituteFetchError ? (
                  <p className="text-xs text-rose-500 italic p-3 border border-dashed border-rose-200 rounded-xl text-center bg-rose-50/30">
                    {instituteFetchError}
                  </p>
                ) : cityInstitutes.length === 0 ? (
                  <p className="text-xs text-slate-400 italic p-3 border border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                    No institutes found for this city. You can add them under City Management.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                    {cityInstitutes.map((inst) => {
                      const isSelected = selectedInstitutes.includes(inst.id);
                      return (
                        <button
                          key={inst.id}
                          type="button"
                          onClick={() => handleToggleInstitute(inst.id)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left cursor-pointer ${isSelected
                              ? "bg-orange-50 border-orange-300 text-orange-950 font-bold"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                          <span
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${isSelected ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300 bg-white"
                              }`}
                          >
                            {isSelected && <span className="text-[9px]">✓</span>}
                          </span>
                          <span className="truncate">{inst.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {amenities.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleToggleAmenity(amenity.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition text-left cursor-pointer ${isSelected
                            ? "bg-orange-50 border-orange-300 text-orange-950 font-bold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${isSelected ? "bg-orange-500 border-orange-500 text-white" : "border-slate-300 bg-white"
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

          {/* TAB 4: PHOTOS & MEDIA (firstImage and secondImage removed) */}
          {activeTab === "media" && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Front Cover Image */}
              <FormField
                label="Front Cover Image"
                hint="Main hero photo shown on listing cards."
                error={clientErrors.frontImage}
              >
                <div className="space-y-2">
                  {newFrontPreview ? (
                    <div className="relative w-full h-44 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={newFrontPreview} alt="New Cover Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setNewFrontFile(null);
                          setNewFrontPreview(null);
                        }}
                        className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Icon name="x" size={12} />
                        <span>Cancel Replacement</span>
                      </button>
                    </div>
                  ) : existingFrontUrl ? (
                    <div className="relative w-full h-44 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={existingFrontUrl} alt="Existing Cover" className="w-full h-full object-cover" />
                      <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <span className="px-3.5 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-bold shadow-md">
                          Replace Cover Photo
                        </span>
                        <input type="file" accept="image/*" onChange={handleFrontImageChange} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-200 hover:border-orange-400 hover:bg-orange-50/20 rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center">
                      <Icon name="home" size={24} className="text-slate-400" />
                      <span className="text-xs font-bold text-orange-600">Upload Front Cover Photo</span>
                      <input type="file" accept="image/*" onChange={handleFrontImageChange} className="hidden" />
                    </label>
                  )}
                </div>
              </FormField>

              {/* Gallery Images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Property Photo Gallery
                  </label>
                  <label className="text-xs font-bold text-orange-600 hover:underline cursor-pointer flex items-center gap-1">
                    <Icon name="plus" size={12} />
                    <span>Add More Photos</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryFilesChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {(hostel.galleryImages || []).map((img, idx) => {
                    const u = getMediaUrl(img.url || img.publickey);
                    return (
                      <div key={`existing-${idx}`} className="relative aspect-video rounded-xl border border-slate-200 overflow-hidden group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={u || undefined} alt={`Existing Gallery ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                  {newGalleryPreviews.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-video rounded-xl border border-orange-300 overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`New Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewGalleryImage(idx)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-md bg-slate-900/80 hover:bg-rose-600 text-white flex items-center justify-center transition cursor-pointer"
                      >
                        <Icon name="x" size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PDF Brochure */}
              <FormField label="Hostel Brochure PDF" hint="Downloadable property info sheet.">
                <div className="space-y-2">
                  {existingBrochureUrl && !removeBrochure && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-semibold truncate">
                        <Icon name="fileText" size={14} className="text-orange-500 shrink-0" />
                        <span className="truncate">Current Brochure: {hostel.brochure?.publickey}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={existingBrochureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline font-bold"
                        >
                          View
                        </a>
                        <button
                          type="button"
                          onClick={() => setRemoveBrochure(true)}
                          className="text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}

                  {(!existingBrochureUrl || removeBrochure) && (
                    <div className="flex items-center gap-3">
                      <label className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 cursor-pointer transition flex items-center gap-2">
                        <Icon name="fileText" size={13} />
                        <span>{newBrochureFile ? newBrochureFile.name : "Upload New Brochure (PDF)"}</span>
                        <input
                          type="file"
                          accept="application/pdf"
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
                      {newBrochureFile && (
                        <button
                          type="button"
                          onClick={() => setNewBrochureFile(null)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-semibold cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </FormField>
            </div>
          )}

          {/* TAB 5: SEO METADATA */}
          {activeTab === "seo" && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <FormField label="Meta Title" hint="Overrides default title tag in search results.">
                <TextInput
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="e.g. Luxury Student PG in Koramangala | Aurus Residences"
                  disabled={isSubmitting}
                />
              </FormField>

              <FormField label="Meta Description" hint="Search snippet description (under 160 chars recommended).">
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="e.g. Discover luxury student living near NMIMS and Mithibai with chef-prepared meals, daily cleaning, and ultra-fast Wi-Fi."
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </FormField>

              <FormField label="Keywords" hint="Comma-separated keywords (e.g., student hostel, girls pg, co-ed living).">
                <TextInput
                  value={metaKeywordsInput}
                  onChange={(e) => setMetaKeywordsInput(e.target.value)}
                  placeholder="e.g. luxury pg, student residence, koramangala hostel"
                  disabled={isSubmitting}
                />
              </FormField>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {activeTab !== "basic" && (
              <Btn
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const idx = TABS.indexOf(activeTab);
                  if (idx > 0) setActiveTab(TABS[idx - 1]);
                }}
                disabled={isSubmitting}
              >
                ← Back
              </Btn>
            )}
            {activeTab !== "seo" && (
              <Btn
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const idx = TABS.indexOf(activeTab);
                  if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1]);
                }}
                disabled={isSubmitting}
              >
                Next Step →
              </Btn>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <Btn
              variant="ghost"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
              type="button"
            >
              Cancel
            </Btn>
            <Btn
              variant="brand"
              size="md"
              onClick={handleSubmit}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin">
                    <Icon name="refresh" size={13} />
                  </span>
                  <span>Updating Property…</span>
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

const TABS: HostelTab[] = ["basic", "location", "pricing", "media", "seo"];
