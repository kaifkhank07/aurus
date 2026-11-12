import {
  JournalArticle,
  CommunityBannerData,
  AurusJournalBlogData,
  journalSectionData,
  communityBannerData,
} from "./aurusJournalBlog";

export type { JournalArticle, CommunityBannerData, AurusJournalBlogData };

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
  journalSection: AurusJournalBlogData;
  communityBanner: CommunityBannerData;
}

export const blogsData: BlogsPageData = {
  journalSection: journalSectionData,
  communityBanner: communityBannerData,
};
