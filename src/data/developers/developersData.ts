import { developerHeroData, DeveloperHeroData } from "./developerHero";
import { strategicPartnerData, StrategicPartnerData, StrategicPartnerStat } from "./strategicPartner";
import { assetClassData, AssetClassData, AssetClassItem } from "./assetClass";
import { partnershipModelsData, PartnershipModelsData, PartnershipModel } from "./partnershipModels";
import { idealAssetsData, IdealAssetsData, IdealAssetCriterion } from "./idealAssets";
import { executionProcessData, ExecutionProcessData, ExecutionStep } from "./executionProcess";
import { submitProjectData, SubmitProjectData } from "./submitProject";

export type {
  DeveloperHeroData,
  StrategicPartnerStat,
  StrategicPartnerData,
  AssetClassItem,
  AssetClassData,
  PartnershipModel,
  PartnershipModelsData,
  IdealAssetCriterion,
  IdealAssetsData,
  ExecutionStep,
  ExecutionProcessData,
  SubmitProjectData,
};

export interface DevelopersPageData {
  hero: DeveloperHeroData;
  strategicPartner: StrategicPartnerData;
  assetClass: AssetClassData;
  partnershipModels: PartnershipModelsData;
  idealAssets: IdealAssetsData;
  executionProcess: ExecutionProcessData;
  submitProject: SubmitProjectData;
}

export const developersData: DevelopersPageData = {
  hero: developerHeroData,
  strategicPartner: strategicPartnerData,
  assetClass: assetClassData,
  partnershipModels: partnershipModelsData,
  idealAssets: idealAssetsData,
  executionProcess: executionProcessData,
  submitProject: submitProjectData,
};
