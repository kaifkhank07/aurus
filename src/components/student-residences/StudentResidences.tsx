import { Journey } from "../ui/Journey";
import { Testimonial } from "../ui/Testimonial";
import { Amenities } from "./Amenities";
import { ChapterBlock } from "./ChapterBlock";
import { Culture } from "./Culture";
import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { Locations } from "./Locations";
import { RealLife } from "./RealLife";
import { Residences } from "./Residences";

export default function StudentResidences() {
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
