export interface OnboardingStep {
  number: string;
  title: string;
  description: string;
}

export interface HowItWorksData {
  eyebrowLeft: string;
  eyebrowRight: string;
  steps: OnboardingStep[];
}

export const managedHowItWorks: HowItWorksData = {
  eyebrowLeft: "06 // HOW IT WORKS",
  eyebrowRight: "SEAMLESS ONBOARDING",
  steps: [
    {
      number: "01",
      title: "BOOK A VIEWING",
      description:
        "Visit the residence or ask for a video walkthrough.",
    },
    {
      number: "02",
      title: "CHOOSE YOUR HOME",
      description:
        "Pick a studio or one-bedroom and your move-in date.",
    },
    {
      number: "03",
      title: "SIGN DIGITALLY",
      description:
        "A simple agreement and one refundable deposit.",
    },
    {
      number: "04",
      title: "MOVE IN",
      description:
        "Arrive with a suitcase. Everything else is ready.",
    },
  ],
};
