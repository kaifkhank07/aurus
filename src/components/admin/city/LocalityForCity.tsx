"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useMasterStore } from "@/store/useMasterStore";
import { Chip, Btn, FormField, TextInput } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";
import { SafeCity } from "@/types/city.types";
import { SafeLocality } from "@/types/locality.types";

export interface LocalityForCityProps {
  open: boolean;
  city: SafeCity | null;
  onClose: () => void;
}

export default function LocalityForCity({ open, city, onClose }: LocalityForCityProps) {
  const {
    localities,
    isLoadingLocalities,
    localitiesError,
    fetchLocalities,
    createLocality,
    updateLocality,
    deleteLocality,
  } = useMasterStore();

  // Search filter
  const [search, setSearch] = useState("");

  // Creation form state
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIsActive, setNewIsActive] = useState(true);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Edit row state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete target state
  const [deletingLocality, setDeletingLocality] = useState<SafeLocality | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Feedback banner
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Load localities for this city
  const loadLocalities = useCallback(
    async (force = false) => {
      if (!city) return;
      await fetchLocalities({ city: city.id, limit: 100 }, force);
    },
    [city, fetchLocalities]
  );

  useEffect(() => {
    if (open && city) {
      loadLocalities(true);
    }
  }, [open, city, loadLocalities]);

  // Auto-dismiss feedback
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Filter localities by search text and city ID
  const cityLocalities = useMemo(() => {
    if (!city) return [];
    return localities.filter((loc) => {
      const matchesCity =
        typeof loc.city === "string"
          ? loc.city === city.id
          : loc.city && typeof loc.city === "object"
          ? (loc.city as SafeCity).id === city.id
          : false;

      if (!matchesCity) return false;

      if (!search.trim()) return true;
      return (
        loc.name.toLowerCase().includes(search.toLowerCase()) ||
        loc.slug.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [localities, city, search]);

  if (!open || !city) return null;

  // Handle Create Locality
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setCreateError("Locality name is required.");
      return;
    }

    setCreateError(null);
    setIsCreating(true);

    const res = await createLocality({
      name: newName.trim(),
      city: city.id,
      isActive: newIsActive,
    });

    setIsCreating(false);

    if (res.success) {
      setNewName("");
      setNewIsActive(true);
      setIsAdding(false);
      setFeedback({ type: "success", message: `Locality "${res.data?.name}" added!` });
      loadLocalities(true);
    } else {
      setCreateError(res.message || "Failed to create locality.");
    }
  };

  // Handle Edit Locality
  const handleStartEdit = (item: SafeLocality) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditIsActive(item.isActive);
  };

  const handleEditSubmit = async (id: string) => {
    if (!editName.trim()) return;

    setIsUpdating(true);
    const res = await updateLocality(id, {
      name: editName.trim(),
      isActive: editIsActive,
    });
    setIsUpdating(false);

    if (res.success) {
      setEditingId(null);
      setFeedback({ type: "success", message: "Locality updated successfully!" });
      loadLocalities(true);
    } else {
      setFeedback({ type: "error", message: res.message || "Failed to update locality." });
    }
  };

  // Handle Toggle Status
  const handleToggleStatus = async (item: SafeLocality) => {
    setTogglingId(item.id);
    const nextStatus = !item.isActive;

    const res = await updateLocality(item.id, { isActive: nextStatus });
    setTogglingId(null);

    if (res.success) {
      setFeedback({
        type: "success",
        message: `"${item.name}" is now ${nextStatus ? "Active" : "Inactive"}.`,
      });
      loadLocalities(true);
    } else {
      setFeedback({
        type: "error",
        message: res.message || "Failed to update status.",
      });
    }
  };

  // Handle Delete Locality
  const handleDeleteConfirm = async () => {
    if (!deletingLocality) return;

    setIsDeleting(true);
    setDeleteError(null);

    const res = await deleteLocality(deletingLocality.id);
    setIsDeleting(false);

    if (res.success) {
      setDeletingLocality(null);
      setFeedback({ type: "success", message: "Locality deleted successfully." });
      loadLocalities(true);
    } else {
      setDeleteError(res.message || "Cannot delete locality.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isCreating && !isUpdating && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800">
                <Icon name="pin" size={11} />
                <span>
                  {city.city}, {city.state}
                </span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                ({cityLocalities.length} {cityLocalities.length === 1 ? "locality" : "localities"})
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              City Localities & Neighborhoods
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Manage local zones and residential sectors in {city.city}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isAdding && (
              <Btn
                variant="brand"
                size="sm"
                onClick={() => {
                  setIsAdding(true);
                  setNewName("");
                  setCreateError(null);
                }}
              >
                <Icon name="plus" size={13} />
                <span>Add Locality</span>
              </Btn>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <Icon name="x" size={15} />
            </button>
          </div>
        </div>

        {/* Modal Feedback Toast */}
        {feedback && (
          <div
            className={`p-3 text-xs font-semibold flex items-center justify-between border-b ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            <span>{feedback.message}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-slate-400 hover:text-slate-600"
            >
              <Icon name="x" size={12} />
            </button>
          </div>
        )}

        {/* Expandable Add Locality Box */}
        {isAdding && (
          <form
            onSubmit={handleCreateSubmit}
            className="p-4 bg-orange-50/50 border-b border-orange-200/70 space-y-3 animate-in slide-in-from-top-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
                <Icon name="plus" size={12} />
                Add New Locality in {city.city}
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>

            {createError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {createError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-7">
                <FormField label="Locality Name *">
                  <TextInput
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Kothrud, Viman Nagar, Hinjewadi"
                    disabled={isCreating}
                    autoFocus
                  />
                </FormField>
              </div>

              <div className="sm:col-span-3 flex items-center gap-2 pb-2">
                <input
                  type="checkbox"
                  id="new-loc-active"
                  checked={newIsActive}
                  onChange={(e) => setNewIsActive(e.target.checked)}
                  disabled={isCreating}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300 transition cursor-pointer"
                />
                <label
                  htmlFor="new-loc-active"
                  className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
                >
                  Active
                </label>
              </div>

              <div className="sm:col-span-2 flex items-center gap-2">
                <Btn
                  variant="brand"
                  size="sm"
                  type="submit"
                  disabled={isCreating}
                  className="w-full"
                >
                  {isCreating ? "Saving…" : "Save"}
                </Btn>
              </div>
            </div>
          </form>
        )}

        {/* Delete Confirmation Card */}
        {deletingLocality && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 space-y-2 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">
                Confirm Deletion of Locality
              </span>
              <button
                type="button"
                onClick={() => setDeletingLocality(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Icon name="x" size={13} />
              </button>
            </div>

            <p className="text-xs text-rose-800">
              Are you sure you want to permanently delete{" "}
              <strong>&ldquo;{deletingLocality.name}&rdquo;</strong>?
            </p>

            {deleteError && (
              <p className="text-xs font-semibold text-rose-700 bg-white p-2 rounded border border-rose-200">
                {deleteError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <Btn
                variant="ghost"
                size="sm"
                onClick={() => setDeletingLocality(null)}
                disabled={isDeleting}
              >
                Cancel
              </Btn>
              <Btn
                variant="danger"
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting…" : "Confirm Delete"}
              </Btn>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="p-3 sm:px-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/40">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon name="search" size={13} />
            </div>
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter localities in this city…"
              className="pl-8 text-xs py-1.5"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <Icon name="x" size={12} />
              </button>
            )}
          </div>

          <Btn
            variant="ghost"
            size="sm"
            onClick={() => loadLocalities(true)}
            disabled={isLoadingLocalities}
            title="Refresh"
          >
            <span
              className={`inline-block transition-transform duration-500 ${
                isLoadingLocalities ? "rotate-180" : ""
              }`}
            >
              <Icon name="refresh" size={12} />
            </span>
          </Btn>
        </div>

        {/* Server Error Alert */}
        {localitiesError && (
          <div className="p-3 bg-rose-50 border-b border-rose-100 text-rose-700 text-xs font-medium flex items-center justify-between">
            <span>{localitiesError}</span>
            <Btn variant="danger" size="sm" onClick={() => loadLocalities(true)}>
              Retry
            </Btn>
          </div>
        )}

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 z-10">
                <th className="py-2.5 px-4">Locality Name & Slug</th>
                <th className="py-2.5 px-4 w-28">Status</th>
                <th className="py-2.5 px-4 w-32">Created</th>
                <th className="py-2.5 px-4 text-right w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoadingLocalities && cityLocalities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="inline-block animate-spin text-orange-500">
                        <Icon name="refresh" size={18} />
                      </span>
                      <span className="text-xs font-medium">Loading localities…</span>
                    </div>
                  </td>
                </tr>
              ) : cityLocalities.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-slate-400">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                        <Icon name="pin" size={20} />
                      </div>
                      <p className="text-xs font-bold text-slate-700">No localities found</p>
                      <p className="text-[11px] text-slate-400">
                        {search.trim()
                          ? `No localities match "${search}" in ${city.city}.`
                          : `No localities have been registered for ${city.city} yet.`}
                      </p>
                      {!search.trim() && (
                        <Btn
                          variant="brand"
                          size="sm"
                          onClick={() => {
                            setIsAdding(true);
                            setNewName("");
                          }}
                          className="mt-1"
                        >
                          <Icon name="plus" size={12} />
                          <span>Add First Locality</span>
                        </Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                cityLocalities.map((item) => {
                  const isEditingThis = editingId === item.id;
                  const isTogglingThis = togglingId === item.id;
                  const createdFormatted = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—";

                  if (isEditingThis) {
                    return (
                      <tr key={item.id} className="bg-orange-50/40">
                        <td className="py-2 px-4" colSpan={2}>
                          <div className="flex items-center gap-2">
                            <TextInput
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              disabled={isUpdating}
                              className="text-xs py-1"
                              autoFocus
                            />
                            <div className="flex items-center gap-1.5 shrink-0">
                              <input
                                type="checkbox"
                                id={`edit-act-${item.id}`}
                                checked={editIsActive}
                                onChange={(e) => setEditIsActive(e.target.checked)}
                                disabled={isUpdating}
                                className="w-3.5 h-3.5 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
                              />
                              <label
                                htmlFor={`edit-act-${item.id}`}
                                className="text-[11px] font-semibold text-slate-700"
                              >
                                Active
                              </label>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-4 text-slate-400 text-[11px]">Editing…</td>
                        <td className="py-2 px-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Btn
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingId(null)}
                              disabled={isUpdating}
                            >
                              Cancel
                            </Btn>
                            <Btn
                              variant="brand"
                              size="sm"
                              onClick={() => handleEditSubmit(item.id)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Saving…" : "Save"}
                            </Btn>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group select-text"
                    >
                      <td className="py-2.5 px-4 min-w-[180px]">
                        <div className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors flex items-center gap-1.5">
                          <Icon name="pin" size={12} className="text-orange-500 shrink-0" />
                          <span>{item.name}</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 ml-4.5">
                          /{item.slug}
                        </div>
                      </td>

                      <td className="py-2.5 px-4">
                        <Chip tone={item.isActive ? "mint" : "rose"} dot>
                          {item.isActive ? "Active" : "Inactive"}
                        </Chip>
                      </td>

                      <td className="py-2.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {createdFormatted}
                      </td>

                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            disabled={isTogglingThis}
                            title={item.isActive ? "Deactivate" : "Activate"}
                            className={`p-1.5 rounded-lg border transition cursor-pointer disabled:opacity-50 ${
                              item.isActive
                                ? "border-slate-200 text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            {isTogglingThis ? (
                              <span className="inline-block animate-spin">
                                <Icon name="refresh" size={12} />
                              </span>
                            ) : (
                              <Icon name={item.isActive ? "x" : "check"} size={12} />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            title="Edit locality"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                          >
                            <Icon name="pen" size={12} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setDeletingLocality(item);
                              setDeleteError(null);
                            }}
                            title="Delete locality"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          >
                            <Icon name="trash" size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div>
            Showing <strong>{cityLocalities.length}</strong> localities in{" "}
            <strong className="text-slate-700">{city.city}</strong>
          </div>
          <Btn variant="ghost" size="sm" onClick={onClose}>
            Close
          </Btn>
        </div>
      </div>
    </div>
  );
}
