import LifeHero from "@/components/lifeataurus/LifeHero";
import LivingHereMeans from "@/components/lifeataurus/LivingHereMeans";
import DayAtAurus from "@/components/lifeataurus/DayAtAurus";
import TheDetails from "@/components/lifeataurus/TheDetails";
import LifeMoments from "@/components/lifeataurus/LifeMoments";
import CafeAndApp from "@/components/lifeataurus/CafeAndApp";
import { Journey } from "@/components/shared/Journey";


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

