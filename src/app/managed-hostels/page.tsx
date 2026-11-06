import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Managed Hostels | Premium Co-living & Hospitality by AURUS",
  description:
    "Experience turnkey managed living by Aurus. Designed for students and young professionals seeking luxury, hospitality-driven amenities, reliable services, and inspiring shared spaces.",
  keywords: [
    "managed hostels",
    "luxury managed hostel",
    "co-living management",
    "hospitality student living",
    "Aurus managed hostels",
    "premium accommodation India",
    "turnkey student housing",
  ],
  alternates: {
    canonical: "/managed-hostels",
  },
  openGraph: {
    title: "Managed Hostels | Premium Co-living & Hospitality by AURUS",
    description:
      "Turnkey managed hostels with world-class hospitality, security, and vibrant community amenities.",
    url: "/managed-hostels",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Managed Hostels | Premium Co-living & Hospitality by AURUS",
    description:
      "Turnkey managed hostels for students and young professionals across India.",
  },
};

export default function ManagedHostelsPage() {
  return (
    <main className="flex flex-col gap-5 min-h-dvh items-center justify-center">
      <h1 className="text-3xl font-bold">Managed Hostels</h1>
      <p className="text-xl font-medium">
        Managed Hostels Page content update here
      </p>
    </main>
  );
}

