"use client";

import React from "react";
import { useRouter } from "next/navigation";
import CreateBlog from "./CreateBlog";

export default function BlogCreatePage() {
  const router = useRouter();

  return (
    <div className="py-2">
      <CreateBlog
        open={true}
        mode="page"
        onClose={() => router.push("/admin/blog")}
        onSuccess={() => router.push("/admin/blog")}
      />
    </div>
  );
}

