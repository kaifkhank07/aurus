import { journalSectionData, communityBannerData, AurusJournalData, CommunityBannerData, JournalArticle } from "./aurusJournal";

export type { JournalArticle, CommunityBannerData, AurusJournalData };

export interface StoriesPageData {
  journalSection: AurusJournalData;
  communityBanner: CommunityBannerData;
}

export const storiesData: StoriesPageData = {
  journalSection: journalSectionData,
  communityBanner: communityBannerData,
};
