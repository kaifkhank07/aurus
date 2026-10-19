import { Hero } from "@/components/student-residences/Hero";
import { Intro } from "@/components/student-residences/Intro";
import { ChapterBlock } from "@/components/student-residences/ChapterBlock";
import { Residences } from "@/components/student-residences/Residences";
import { Locations } from "@/components/student-residences/Locations";
import { Amenities } from "@/components/student-residences/Amenities";
import { RealLife } from "@/components/student-residences/RealLife";
import { Culture } from "@/components/student-residences/Culture";
import { Testimonial } from "@/components/ui/Testimonial";
import { Journey } from "@/components/ui/Journey";

export default function Home() {
  return (
    <main>
      <Hero />
      <Intro />
      <ChapterBlock />
      <Residences />
      <Locations />
      <Amenities />
      <RealLife />
      <Culture />
      <Testimonial />
      <Journey />
    </main>
  );
}
