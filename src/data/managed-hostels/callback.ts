import { componyInfoData } from "../compony/infro";

export interface CallbackData {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  subtitle: string;
  helpline: {
    label: string;
    value: string;
    phone: string;
    cta: string;
  };
  whatsapp: {
    label: string;
    value: string;
    number: string;
    cta: string;
  };
  formEyebrow: string;
  formTitleTop: string;
  formTitleAccent: string;
  submitCta: string;
}

export const managedCallback: CallbackData = {
  eyebrow: "ENQUIRE",
  titleTop: "MOVE TO GIFT CITY,",
  titleAccent: "Sorted.",
  subtitle:
    "Tell us when you are moving and what you need. A residence advisor will call you back, usually within the hour during concierge hours.",
  helpline: {
    label: "Call Direct Helpline",
    value: `+91 ${componyInfoData.mobile}`,
    phone: `+91${componyInfoData.mobile}`,
    cta: "Connect on Call",
  },
  whatsapp: {
    label: "WhatsApp",
    value: "Chat with a residence advisor in real-time",
    number: `91${componyInfoData.whatsapp}`,
    cta: "Start A Chat",
  },
  formEyebrow: "GENERAL ENQUIRIES · GIFT CITY",
  formTitleTop: "REQUEST A",
  formTitleAccent: "Callback.",
  submitCta: "Submit Request",
};
