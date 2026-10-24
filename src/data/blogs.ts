export interface JournalArticle {
  id: string;
  image: string;
  alt: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  ctaText: string;
  href: string;
}

export interface CommunityBannerData {
  titleTop: string;
  titleAccent: string;
  description: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface BlogSectionPoint {
  title: string;
  description: string;
}

export interface BlogDetailData {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  image: string;
  alt: string;
  intro: string;
  sections: BlogSectionPoint[];
  conclusion: string;
  author: string;
}

export interface BlogsPageData {
  journalSection: {
    titleTop: string;
    titleAccent: string;
    body: string;
    articles: JournalArticle[];
  };
  communityBanner: CommunityBannerData;
}

export const singleBlogData: BlogDetailData = {
  slug: "guide-luxury-pgs-nmims-mithibai",
  category: "CITY GUIDES",
  date: "SEP 14, 2026",
  readTime: "4 MIN READ",
  title: "The Ultimate Guide to Luxury PGs near NMIMS & Mithibai (Vile Parle 2026)",
  image: "/images/blog01.png",
  alt: "The Ultimate Guide to Luxury PGs near NMIMS & Mithibai",
  intro:
    "Vile Parle is one of Mumbai's premier student neighbourhoods: NMIMS, Mithibai, DJ Sanghvi, Sathaye and NM College all sit within a few square kilometres, and every August thousands of students arrive looking for a room. Most end up in a PG they will hate by November. Here is the guide we wish someone had handed us.",
  sections: [
    {
      title: "1. Distance is measured in minutes, not kilometres",
      description:
        "A distance 1.5 km away can be a 35-minute walk in monsoon traffic. Look for places you can reach on foot in under seven minutes — Chapters I, II and IV at Aurus are all within a short walk of the NMIMS gate.",
    },
    {
      title: "2. Ask exactly how security works",
      description:
        "“24/7 security” can mean one sleepy watchman. Ask about biometric or facial entry, female guards for girls' wings, CCTV in common areas, and a visitor log. If the answer is vague, move on.",
    },
    {
      title: "3. Eat before you sign",
      description:
        "Ask to have a meal there. A residence that will not let you taste its food during a visit is telling you something. At Aurus we serve four meals a day and you are welcome to join any of them on a tour.",
    },
    {
      title: "4. Find the quiet",
      description:
        "Hostel rooms are fine; shared noise is not. Look for a dedicated study space that is separate and actually silent. Acoustic study pods are standard in every Aurus Chapter.",
    },
  ],
  conclusion:
    "Ready to compare? Explore the Mumbai chapters or book a guided visit — our concierge will walk you through all of the above.",
  author: "AURUS EDITORIAL TEAM",
};

export const blogsData: BlogsPageData = {
  journalSection: {
    titleTop: "THE AURUS",
    titleAccent: "Journal.",
    body: "Insights on relocation, student life in Mumbai, Noida & Pune, study productivity hacks, and hostel guides.",
    articles: [
      {
        id: "journal-1",
        image: "/images/blog01.png",
        alt: "The Ultimate Guide to Luxury PGs near NMIMS & Mithibai",
        category: "CITY GUIDES",
        date: "SEP 14, 2026",
        readTime: "4 MIN READ",
        title:
          "The Ultimate Guide to Luxury PGs near NMIMS & Mithibai (Vile Parle 2026)",
        excerpt:
          "Finding student accommodation in Mumbai can be chaotic. Here is what to look for: distance, safety protocols, dining options, and quiet study spaces.",
        ctaText: "READ GUIDE",
        href: "/blog/guide-luxury-pgs-nmims-mithibai",
      },
      {
        id: "journal-2",
        image: "/images/blog02.png",
        alt: "Why Gen Z Students in Noida Are Upgrading from Generic Hostels to Lifestyle Residences",
        category: "STUDENT LIFE",
        date: "AUG 28, 2026",
        readTime: "5 MIN READ",
        title:
          "Why Gen Z Students in Noida Are Upgrading from Generic Hostels to Lifestyle Residences",
        excerpt:
          "Sector 126 and Knowledge Park in Noida are booming. Explore why modern students demand hospitality-driven living spaces.",
        ctaText: "READ GUIDE",
        href: "/blog/gen-z-noida-hostels-lifestyle-residences",
      },
      {
        id: "journal-3",
        image: "/images/blog03.png",
        alt: "Minimalist Packing List: Everything You Need for Your First Month at Aurus",
        category: "ESSENTIAL TIPS",
        date: "AUG 10, 2026",
        readTime: "3 MIN READ",
        title:
          "Minimalist Packing List: Everything You Need for Your First Month at Aurus",
        excerpt:
          "Since Aurus includes premium bedding, towels, and daily housekeeping, your packing list gets cut in half!",
        ctaText: "READ GUIDE",
        href: "/blog/minimalist-packing-list-first-month",
      },
      {
        id: "journal-4",
        image: "/images/blog04.png",
        alt: "The Ultimate Guide to Luxury PGs near NMIMS & Mithibai",
        category: "CITY GUIDES",
        date: "SEP 14, 2026",
        readTime: "4 MIN READ",
        title:
          "The Ultimate Guide to Luxury PGs near NMIMS & Mithibai (Vile Parle 2026)",
        excerpt:
          "Finding student accommodation in Mumbai can be chaotic. Here is what to look for: distance, safety protocols, dining options, and quiet study spaces.",
        ctaText: "READ GUIDE",
        href: "/blog/guide-luxury-pgs-nmims-mithibai",
      },
      {
        id: "journal-5",
        image: "/images/blog05.png",
        alt: "Why Gen Z Students in Noida Are Upgrading from Generic Hostels to Lifestyle Residences",
        category: "STUDENT LIFE",
        date: "AUG 28, 2026",
        readTime: "5 MIN READ",
        title:
          "Why Gen Z Students in Noida Are Upgrading from Generic Hostels to Lifestyle Residences",
        excerpt:
          "Sector 126 and Knowledge Park in Noida are booming. Explore why modern students demand hospitality-driven living spaces.",
        ctaText: "READ GUIDE",
        href: "/blog/gen-z-noida-hostels-lifestyle-residences",
      },
      {
        id: "journal-6",
        image: "/images/blog06.png",
        alt: "Minimalist Packing List: Everything You Need for Your First Month at Aurus",
        category: "ESSENTIAL TIPS",
        date: "AUG 10, 2026",
        readTime: "3 MIN READ",
        title:
          "Minimalist Packing List: Everything You Need for Your First Month at Aurus",
        excerpt:
          "Since Aurus includes premium bedding, towels, and daily housekeeping, your packing list gets cut in half!",
        ctaText: "READ GUIDE",
        href: "/blog/minimalist-packing-list-first-month",
      },
      {
        id: "journal-7",
        image: "/images/journal-1.png",
        alt: "The Ultimate Guide to Luxury PGs near NMIMS & Mithibai",
        category: "CITY GUIDES",
        date: "SEP 14, 2026",
        readTime: "4 MIN READ",
        title:
          "The Ultimate Guide to Luxury PGs near NMIMS & Mithibai (Vile Parle 2026)",
        excerpt:
          "Finding student accommodation in Mumbai can be chaotic. Here is what to look for: distance, safety protocols, dining options, and quiet study spaces.",
        ctaText: "READ GUIDE",
        href: "/blog/guide-luxury-pgs-nmims-mithibai",
      },
      {
        id: "journal-8",
        image: "/images/journal-2.png",
        alt: "Why Gen Z Students in Noida Are Upgrading from Generic Hostels to Lifestyle Residences",
        category: "STUDENT LIFE",
        date: "AUG 28, 2026",
        readTime: "5 MIN READ",
        title:
          "Why Gen Z Students in Noida Are Upgrading from Generic Hostels to Lifestyle Residences",
        excerpt:
          "Sector 126 and Knowledge Park in Noida are booming. Explore why modern students demand hospitality-driven living spaces.",
        ctaText: "READ GUIDE",
        href: "/blog/gen-z-noida-hostels-lifestyle-residences",
      },
      {
        id: "journal-9",
        image: "/images/journal-3.png",
        alt: "Minimalist Packing List: Everything You Need for Your First Month at Aurus",
        category: "ESSENTIAL TIPS",
        date: "AUG 10, 2026",
        readTime: "3 MIN READ",
        title:
          "Minimalist Packing List: Everything You Need for Your First Month at Aurus",
        excerpt:
          "Since Aurus includes premium bedding, towels, and daily housekeeping, your packing list gets cut in half!",
        ctaText: "READ GUIDE",
        href: "/blog/minimalist-packing-list-first-month",
      },
    ],
  },
  communityBanner: {
    titleTop: "One good read,",
    titleAccent: "Every Sunday.",
    description: "New journal articles and the occasional city guide, in your inbox once a week. No offers, no noise.",
    cta: {
      label: "Subscribe",
      href: "#", 
    },
  },
};
