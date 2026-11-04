import type { Metadata } from "next";
import AssetClass from "@/components/developers/AssetClass";
import DeveloperHero from "@/components/developers/DeveloperHero";
import ExecutionProcess from "@/components/developers/ExecutionProcess";
import IdealAssets from "@/components/developers/IdealAssets";
import PartnershipModels from "@/components/developers/PartnershipModels";
import StrategicPartner from "@/components/developers/StrategicPartner";
import SubmitProjectForm from "@/components/developers/SubmitProjectForm";

export const metadata: Metadata = {
  title: "Partner With Us | Purpose-Built Student Housing for Developers | AURUS",
  description:
    "Partner with Aurus to transform residential and mixed-use real estate into high-yield, purpose-built student housing. Explore partnership models, asset criteria, and end-to-end operational management.",
  keywords: [
    "real estate partnership",
    "student housing developer",
    "PBSA India",
    "Aurus developers",
    "student housing asset class",
    "hostel lease model",
    "property monetisation",
    "institutional student housing",
  ],
  alternates: {
    canonical: "/developers",
  },
  openGraph: {
    title: "Partner With Us | Purpose-Built Student Housing for Developers | AURUS",
    description:
      "Transform real estate into high-yield student housing with Aurus. Comprehensive development and hospitality management.",
    url: "/developers",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner With Us | Purpose-Built Student Housing for Developers | AURUS",
    description:
      "Partner with Aurus to build and operate premium, high-occupancy student housing across India.",
  },
};

export default function DevelopersPage() {
  return (
    <main>
      <DeveloperHero />
      <StrategicPartner />
      <AssetClass />
      <PartnershipModels />
      <IdealAssets />
      <ExecutionProcess />
      <SubmitProjectForm />
    </main>
  );
}
