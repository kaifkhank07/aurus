export interface AdminNavItem {
  href: string;
  label: string;
  icon: string;
  section?: string;
  badge?: string;
  mobile?: boolean;
}

export const adminNav: AdminNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "grid", section: "Home", mobile: true },
  { href: "/admin/city", label: "City", icon: "building", section: "Master Management", mobile: true },
  { href: "/admin/occupancy", label: "Occupancies", icon: "bed", mobile: true },
  { href: "/admin/amenity", label: "Amenities", icon: "flow", mobile: true },
  { href: "/admin/hostel", label: "Hostels", icon: "home", section: "Residence Management", mobile: true },
  { href: "/admin/booked-visit", label: "Booked Visits", icon: "calendar", mobile: true },
  // { href: "/admin/call-request", label: "Callback Requests", icon: "phone", mobile: true },
  { href: "/admin/enquiry", label: "Enquiries", icon: "mail", mobile: true },

  { href: "/admin/blog", label: "Blogs", icon: "fileText", section: "Content Management", mobile: true },
  { href: "/admin/story", label: "Stories", icon: "star", mobile: true },
  { href: "/admin/faq", label: "FAQs", icon: "info", mobile: true },
  // { href: "/admin/admins", label: "Staff & Admins", icon: "head", section: "Administration", mobile: true },
  // { href: "/admin/settings", label: "Settings", icon: "cog" },
];
