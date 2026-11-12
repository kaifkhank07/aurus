import { lifeHeroData, LifeHeroData } from "./lifeHero";
import { livingMeansData, LivingMeansData, LivingFeature } from "./livingHereMeans";
import { dayAtAurusData, DayAtAurusData, TimelineSlot } from "./dayAtAurus";
import { theDetailsData, FacilityData } from "./theDetails";
import { lifeMomentsData, MomentsGalleryData, MomentItem } from "./lifeMoments";
import { cafeAndAppData, CafeAndAppData } from "./cafeAndApp";

export type { LivingFeature, TimelineSlot, FacilityData, MomentItem, MomentsGalleryData, CafeAndAppData, LifeHeroData, LivingMeansData, DayAtAurusData };

export interface LifePageData {
  hero: LifeHeroData;
  livingMeans: LivingMeansData;
  dailyRhythm: DayAtAurusData;
  facilities: FacilityData;
  momentsGallery: MomentsGalleryData;
  cafeAndApp: CafeAndAppData;
}

export const lifePageData: LifePageData = {
  hero: lifeHeroData,
  livingMeans: livingMeansData,
  dailyRhythm: dayAtAurusData,
  facilities: theDetailsData,
  momentsGallery: lifeMomentsData,
  cafeAndApp: cafeAndAppData,
};
