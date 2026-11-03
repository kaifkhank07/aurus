import React from "react";
import BlogEditPage from "@/components/admin/blog/BlogEditPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <BlogEditPage id={id} />;
}

