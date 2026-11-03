"use client";

import React from "react";
import { useRouter } from "next/navigation";
import CreateHostel from "./CreateHostel";

export default function HostelCreatePage() {
  const router = useRouter();

  return (
    <div className="py-2">
      <CreateHostel
        open={true}
        mode="page"
        onClose={() => router.push("/admin/hostel")}
        onSuccess={() => router.push("/admin/hostel")}
      />
    </div>
  );
}

