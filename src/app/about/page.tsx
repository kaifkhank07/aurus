import { AboutHero } from "@/components/about/AboutHero";
import Values from "@/components/about/Values";
import EveryDetail from "@/components/about/EveryDetail";
import CommunitySpaces from "@/components/about/CommunitySpaces";
import CherishExperience from "@/components/about/CherishExperience";
import { Journey } from "@/components/ui/Journey";

export default function About() {
    return (
        <main>
            <AboutHero />
            <Values />
            <EveryDetail />
            <CommunitySpaces />
            <CherishExperience />
            <Journey />
        </main>
    );
}
