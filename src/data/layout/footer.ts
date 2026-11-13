export const footer = {
  tagline: "Crafted for students. Elevated by luxury.",
  columns: [
    {
      title: "Aurus Headquarters",
      type: "text" as const,
      lines: [
        "Andheri East, Mumbai, Maharashtra 400069",
        "Toll-free: 1800-572-0709",
        "Email: info@auruslife.com",
      ],
    },
    {
      title: "Discover",
      type: "links" as const,
      links: [
        { label: "About Us", href: "/about" },
        { label: "Life @ Aurus", href: "/life-at-aurus" },
        { label: "Residences", href: "/hostels" },
        { label: "Stories", href: "/real-stories" },
        { label: "The Aurus Year", href: "/aurusyear" },
        { label: "Developers", href: "/developers" },
        { label: "FAQ", href: "/faq" },
        { label: "Blogs", href: "/blogs" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Our Hostels",
      type: "links" as const,
      links: [
        { label: "Hostels in Mumbai", href: "/hostels/mumbai" },
        { label: "Hostels in Noida", href: "/hostels/noida" },
        { label: "Hostels in Ahmedabad", href: "/hostels/ahmedabad" },
        { label: "Hostels in Pune", href: "/hostels/pune" },
        { label: "Hostels in Jalandhar", href: "/hostels/jalandhar" },
      ],
    },
    {
      title: "Concierge Hours",
      type: "text" as const,
      lines: [
        "Concierge desk active 10:00 AM – 7:00 PM daily. On-site resident wardens 24/7.",
      ],
    },
  ],
};
