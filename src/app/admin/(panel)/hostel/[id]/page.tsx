import React from "react";
import HostelDetailsPage from "@/components/admin/hostel/HostelDetailsPage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <HostelDetailsPage id={id} />;
}

