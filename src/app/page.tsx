import type { Metadata } from "next";
import { Hero } from "@/components/student-residences/Hero";
import { Intro } from "@/components/student-residences/Intro";
import { ChapterBlock } from "@/components/student-residences/ChapterBlock";
import { Residences } from "@/components/student-residences/Residences";
import { Locations } from "@/components/shared/Locations";
import { Amenities } from "@/components/student-residences/Amenities";
import { RealLife } from "@/components/shared/RealLife";
// import { Culture } from "@/components/shared/Culture";
import { Testimonial } from "@/components/shared/Testimonial";
import { Journey } from "@/components/shared/Journey";
import AurusPlaylist from "@/components/shared/AurusPlaylist";

export const metadata: Metadata = {
  title: "Purpose-Built Student Hostels | AURUS",
  description:
    "Explore purpose-built student hostels engineered for focus, connection, and wellbeing. Enjoy luxury ensuite rooms, chef-prepared nutrition, high-speed fibre Wi-Fi, and 24/7 security near your campus.",
  keywords: [
    "purpose-built student accommodation",
    "PBSA India",
    "student hostels",
    "luxury hostel for college students",
    "safe student housing",
    "campus accommodation India",
    "student co-living spaces",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Purpose-Built Student Hostels | AURUS",
    description:
      "Purpose-built student hostels designed for academic focus, safety, and vibrant community connections.",
    url: "/",
    siteName: "AURUS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Purpose-Built Student Hostels | AURUS",
    description:
      "Luxury ensuite rooms, chef-prepared nutrition, and inspiring community living near top university campuses.",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Intro />
      <ChapterBlock />
      <Residences />
      <Locations showHeading={true} />
      <Amenities />
      <RealLife havingTopSpace={true} />
      {/* <Culture /> */}
      <AurusPlaylist />
      <Testimonial />
      <Journey />
    </main>
  );
}




// import type { Metadata } from "next";
// import { ChooseResidence } from "@/components/home/ChooseResidence";
// import Story from "@/components/home/Story";
// import { Locations } from "@/components/shared/Locations";
// import { RealLife } from "@/components/shared/RealLife";
// import { Culture } from "@/components/shared/Culture";
// import { Testimonial } from "@/components/shared/Testimonial";
// import Faq from "@/components/home/Faq";
// import { Journey } from "@/components/shared/Journey";
// import YearRythm from "@/components/home/YearRythm";
// import AurusPlaylist from "@/components/shared/AurusPlaylist";

// export const metadata: Metadata = {
//   title: "AURUS | Luxury Managed Residences & Purpose-Built Student Living",
//   description:
//     "Experience India's premier luxury managed residences. Thoughtfully designed student living with fully furnished rooms, gourmet dining, 24/7 concierge, high-speed fibre Wi-Fi, and vibrant community spaces.",
//   keywords: [
//     "Aurus",
//     "luxury student residences",
//     "managed student accommodation",
//     "premium co-living India",
//     "student housing",
//     "student hostel",
//     "luxury PG",
//     "college residences India",
//   ],
//   alternates: {
//     canonical: "/",
//   },
//   openGraph: {
//     title: "AURUS | Luxury Managed Residences & Purpose-Built Student Living",
//     description:
//       "Thoughtfully designed student living with fully furnished rooms, gourmet dining, 24/7 concierge, and vibrant community spaces across India.",
//     url: "/",
//     siteName: "AURUS",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "AURUS | Luxury Managed Residences & Purpose-Built Student Living",
//     description:
//       "India's premier luxury managed student residences. Fully furnished rooms, chef-crafted meals, and inspiring community living.",
//   },
// };

// export default function Home() {
//   return (
//     <main>
//       <ChooseResidence />
//       <Story />
//       <Locations />
//       <RealLife />
//       <Culture />
//       <YearRythm />
//       <AurusPlaylist />
//       <Testimonial />
//       <Faq />
//       <Journey />
//     </main>
//   );
// }
