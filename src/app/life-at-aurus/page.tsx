import CafeAndApp from "@/components/lifeataurus/CafeAndApp";
import DayAtAurus from "@/components/lifeataurus/DayAtAurus";
import LifeHero from "@/components/lifeataurus/LifeHero";
import LifeMoments from "@/components/lifeataurus/LifeMoments";
import LivingHereMeans from "@/components/lifeataurus/LivingHereMeans";
import TheDetails from "@/components/lifeataurus/TheDetails";
import { Journey } from "@/components/ui/Journey";

export default function LifeAtAurus() {
    return (
        <main>
            <LifeHero />
            <LivingHereMeans />
            <DayAtAurus />
            <TheDetails />
            <LifeMoments />
            <CafeAndApp />
            <Journey />
        </main>
    );
}

