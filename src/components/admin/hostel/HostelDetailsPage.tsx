"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useHostelAndEnquiryStore } from "@/store/useHostelAndEnquiryStore";
import { SafeHostel } from "@/types/hostel.types";
import HostelDetails from "./HostelDetails";
import DeleteHostel from "./DeleteHostel";
import { Btn, Card } from "../ui/AdminUI";
import Icon from "../ui/AdminIcons";

export interface HostelDetailsPageProps {
  id: string;
}

export default function HostelDetailsPage({ id }: HostelDetailsPageProps) {
  const router = useRouter();
  const { getHostelById } = useHostelAndEnquiryStore();

  const [hostel, setHostel] = useState<SafeHostel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadHostel = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getHostelById(id);
      if (res.success && res.data) {
        setHostel(res.data);
      } else {
        setError(res.message || "Hostel residence not found.");
      }
    } catch {
      setError("An unexpected error occurred while loading hostel details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadHostel();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <span className="inline-block animate-spin text-orange-500">
          <Icon name="refresh" size={24} />
        </span>
        <span className="text-xs font-semibold">Loading property details…</span>
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <Card className="text-center p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Icon name="x" size={24} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Hostel Not Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {error || "The property you are looking for could not be found or may have been removed."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/admin/hostel">
              <Btn variant="ghost" size="sm">
                Back to Hostels
              </Btn>
            </Link>
            <Btn variant="brand" size="sm" onClick={loadHostel}>
              Retry
            </Btn>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-2">
      <HostelDetails
        open={true}
        hostel={hostel}
        mode="page"
        onClose={() => router.push("/admin/hostel")}
        onEdit={() => router.push(`/admin/hostel/${id}/edit`)}
        onDelete={() => setDeleting(true)}
      />

      {/* Delete Confirmation Modal */}
      {deleting && (
        <DeleteHostel
          open={deleting}
          hostel={hostel}
          onClose={() => setDeleting(false)}
          onSuccess={() => {
            router.push("/admin/hostel");
          }}
        />
      )}
    </div>
  );
}

