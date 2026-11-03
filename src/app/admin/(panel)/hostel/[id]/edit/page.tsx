import React from "react";
import HostelEditPage from "@/components/admin/hostel/HostelEditPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <HostelEditPage id={id} />;
}

