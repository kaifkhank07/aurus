import { Hero } from "@/components/student-residences/Hero";
import { Intro } from "@/components/student-residences/Intro";
import { ChapterBlock } from "@/components/student-residences/ChapterBlock";
import { Residences } from "@/components/student-residences/Residences";
import { Locations } from "@/components/shared/Locations";
import { Amenities } from "@/components/student-residences/Amenities";
import { RealLife } from "@/components/shared/RealLife";
import { Culture } from "@/components/shared/Culture";
import { Testimonial } from "@/components/shared/Testimonial";
import { Journey } from "@/components/shared/Journey";


export default function StudentResidencesPage() {
    return (
        <main>
            <Hero />
            <Intro />
            <ChapterBlock />
            <Residences />
            <Locations showHeading={true} />
            <Amenities />
            <RealLife havingTopSpace={true} />
            <Culture />
            <Testimonial />
            <Journey />
        </main>
    )
}