import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Managed Residences | Premium Co-living & Hospitality by AURUS",
  description:
    "Experience turnkey managed living by Aurus. Designed for students and young professionals seeking luxury, hospitality-driven amenities, reliable services, and inspiring shared spaces.",
  keywords: [
    "managed residences",
    "luxury managed hostel",
    "co-living management",
    "hospitality student living",
    "Aurus managed residences",
    "premium accommodation India",
    "turnkey student housing",
  ],
  alternates: {
    canonical: "/managed-residences",
  },
  openGraph: {
    title: "Managed Residences | Premium Co-living & Hospitality by AURUS",
    description:
      "Turnkey managed residences with world-class hospitality, security, and vibrant community amenities.",
    url: "/managed-residences",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Managed Residences | Premium Co-living & Hospitality by AURUS",
    description:
      "Turnkey managed residences for students and young professionals across India.",
  },
};

export default function ManagedResidencesPage() {
  return (
    <main className="flex flex-col gap-5 min-h-dvh items-center justify-center">
      <h1 className="text-3xl font-bold">Managed Residences</h1>
      <p className="text-xl font-medium">
        Managed Residences Page content update here
      </p>
    </main>
  );
}
