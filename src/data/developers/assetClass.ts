export interface AssetClassItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AssetClassData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  items: AssetClassItem[];
}

export const assetClassData: AssetClassData = {
  eyebrow: "02 // WHY PURPOSE-BUILT STUDENT HOUSING",
  titleTop: "THE NEXT INSTITUTIONAL",
  titleAccent: "Asset Class.",
  items: [
    {
      id: "demand",
      icon: "trend",
      title: "Demand far beyond supply",
      description:
        "India faces a structural student housing deficit in every major education cluster, creating predictable multi-decade demand for institutional-grade student housing.",
    },
    {
      id: "yield",
      icon: "yield",
      title: "Higher yield per square foot",
      description:
        "Purpose-built student residences deliver higher revenue per square foot than conventional residential or commercial leases, driven by density, amenities, and sticky annual tenancies.",
    },
    {
      id: "occupancy",
      icon: "occupancy",
      title: "Predictable occupancy",
      description:
        "Academic-year lease cycles and long-term university tie-ups create dependable, high-occupancy cash flows insulated from broader economic and corporate downturns.",
    },
    {
      id: "managed",
      icon: "managed",
      title: "A shift to managed living",
      description:
        "Today's students and parents demand hospitality-grade amenities, verified security, chef-prepared dining, and active communities over unorganised PGs and shared flats.",
    },
  ],
};
