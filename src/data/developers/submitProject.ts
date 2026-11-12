export interface SubmitProjectData {
  eyebrow: string;
  title: string;
  body: string;
  email: string;
  propertyTypes: string[];
}

export const submitProjectData: SubmitProjectData = {
  eyebrow: "PARTNER WITH US",
  title: "SUBMIT YOUR PROPERTY OR PROJECT",
  body: "Developers, landowners and investors with land, under-construction projects or ready assets near education hubs — our partnerships team will evaluate the opportunity and get back to you.",
  email: "dev@auruslife.com",
  propertyTypes: [
    "Bare Shell Residential Building",
    "Under Construction Project",
    "Existing Hostel / PG Conversion",
    "Land / Greenfield Plot",
    "Commercial / Hotel Conversion",
  ],
};
