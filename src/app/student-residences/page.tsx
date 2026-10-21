import { Amenities } from "@/components/student-residences/Amenities";
import { ChapterBlock } from "@/components/student-residences/ChapterBlock";
import { Culture } from "@/components/student-residences/Culture";
import { Hero } from "@/components/student-residences/Hero";
import { Intro } from "@/components/student-residences/Intro";
import { Locations } from "@/components/student-residences/Locations";
import { RealLife } from "@/components/student-residences/RealLife";
import { Residences } from "@/components/student-residences/Residences";
import { Journey } from "@/components/ui/Journey";
import { Testimonial } from "@/components/ui/Testimonial";

export default function StudentResidencesPage() {
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
    )
}