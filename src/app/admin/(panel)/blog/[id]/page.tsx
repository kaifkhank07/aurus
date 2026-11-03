import React from "react";
import BlogDetailsPage from "@/components/admin/blog/BlogDetailsPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <BlogDetailsPage id={id} />;
}

