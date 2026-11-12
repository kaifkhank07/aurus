import { talkToUsData, TalkToUsData, ContactChannel } from "./talkToUs";
import { callYouBackData, CallYouBackData, LocationDirectoryItem } from "./callYouBack";

export type { ContactChannel, LocationDirectoryItem, TalkToUsData, CallYouBackData };

export interface ContactPageData {
  hero: TalkToUsData;
  callback: CallYouBackData;
}

export const contactData: ContactPageData = {
  hero: talkToUsData,
  callback: callYouBackData,
};
