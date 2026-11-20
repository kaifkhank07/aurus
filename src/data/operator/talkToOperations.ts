import { componyInfoData } from "../compony/infro";

export interface TalkToOperationsData {
  eyebrow: string;
  title: string;
  body: string;
  email: string;
  submitCta: string;
}

export const talkToOperationsData: TalkToOperationsData = {
  eyebrow: "PARTNER WITH US",
  title: "TALK TO OUR OPERATIONS TEAM",
  body: "Own or manage a student or co-living property? Tell us about it and we’ll share how Aurus would run it.",
  email: `${componyInfoData.email}`,
  submitCta: "SEND ENQUIRY",
};
