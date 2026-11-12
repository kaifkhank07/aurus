import { aboutHeroData, AboutHeroData } from "./hero";
import { aboutStoryData, AboutStoryData } from "./story";
import { aboutValuesData, AboutValuesData, PillarItem } from "./values";
import { aboutEveryDetailData, AboutEveryDetailData, AmenityItem } from "./everyDetail";
import { aboutCommunitySpacesData, AboutCommunitySpacesData, CommunitySpaceItem } from "./communitySpaces";
import { aboutCherishExperienceData, AboutCherishExperienceData, ExperienceFeature } from "./cherishExperience";

export type { PillarItem, AmenityItem, CommunitySpaceItem, ExperienceFeature };
export type { AboutHeroData, AboutStoryData, AboutValuesData, AboutEveryDetailData, AboutCommunitySpacesData, AboutCherishExperienceData };

export interface AboutData {
  hero: AboutHeroData;
  story: AboutStoryData;
  values: AboutValuesData;
  amenities: AboutEveryDetailData;
  communitySpaces: AboutCommunitySpacesData;
  cherishExperience: AboutCherishExperienceData;
}

export const aboutData: AboutData = {
  hero: aboutHeroData,
  story: aboutStoryData,
  values: aboutValuesData,
  amenities: aboutEveryDetailData,
  communitySpaces: aboutCommunitySpacesData,
  cherishExperience: aboutCherishExperienceData,
};
