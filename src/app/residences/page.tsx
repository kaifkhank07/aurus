import { ExploreResidences } from "@/components/residences/ExploreResidences";
import { UpcomingChapters } from "@/components/residences/UpcomingChapters";
import { LifeAtAurus } from "@/components/residences/LifeAtAurus";

export default function ResidencesPage() {
  return (
    <main>
      <ExploreResidences />
      <UpcomingChapters />
      <LifeAtAurus />
    </main>
  );
}
