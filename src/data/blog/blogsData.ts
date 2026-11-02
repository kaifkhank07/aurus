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
  sections?: BlogSectionPoint[];
  conclusion?: string;
  author?: string;
}

export interface BlogsPageData {
  journalSection: {
    titleTop: string;
    titleAccent: string;
    body: string;
    articles?: JournalArticle[];
  };
  communityBanner: CommunityBannerData;
}

export const blogsData: BlogsPageData = {
  journalSection: {
    titleTop: "THE AURUS",
    titleAccent: "Journal.",
    body: "Insights on relocation, student life in Mumbai, Noida & Pune, study productivity hacks, and hostel guides.",
    articles: [],
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
