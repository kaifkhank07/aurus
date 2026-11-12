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

export interface AurusJournalBlogData {
  titleTop: string;
  titleAccent: string;
  body: string;
  articles?: JournalArticle[];
}

export const journalSectionData: AurusJournalBlogData = {
  titleTop: "THE AURUS",
  titleAccent: "Journal.",
  body: "Insights on relocation, student life in Mumbai, Noida & Pune, study productivity hacks, and hostel guides.",
  articles: [],
};

export const communityBannerData: CommunityBannerData = {
  titleTop: "WANT TO BECOME PART OF THE AURUS",
  titleAccent: "Community?",
  description:
    "Join a thriving network of scholars, creators, and future leaders. Schedule a visit or reserve your room today.",
  cta: {
    label: "SCHEDULE VIP VISIT",
    href: "/contact",
  },
};

