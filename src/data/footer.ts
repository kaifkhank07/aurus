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
        { label: "Boutique Workspaces", href: "/workspaces" },
        { label: "Life @ Aurus", href: "/life-at-aurus" },
        { label: "Hostels", href: "/hostels" },
        { label: "Real Stories", href: "/stories" },
        { label: "FAQ", href: "/faq" },
        { label: "Blogs", href: "/blog" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Our Residences",
      type: "links" as const,
      links: [
        { label: "Residences in Mumbai", href: "/residences/mumbai" },
        { label: "Residences in Noida", href: "/residences/noida" },
        { label: "Residences in Ahmedabad", href: "/residences/ahmedabad" },
        { label: "Residences in Pune", href: "/residences/pune" },
        { label: "Residences in Jalandhar", href: "/residences/jalandhar" },
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
