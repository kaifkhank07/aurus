import AssetClass from "@/components/developers/AssetClass";
import DeveloperHero from "@/components/developers/DeveloperHero";
import ExecutionProcess from "@/components/developers/ExecutionProcess";
import IdealAssets from "@/components/developers/IdealAssets";
import PartnershipModels from "@/components/developers/PartnershipModels";
import StrategicPartner from "@/components/developers/StrategicPartner";
import SubmitProjectForm from "@/components/developers/SubmitProjectForm";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Partner With Us | AURUS Purpose-Built Student Housing for Developers",
  description:
    "Partner with developers, landowners and institutional investors to turn residential and mixed-use real estate into premium, high-occupancy student housing — from concept to operations.",
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