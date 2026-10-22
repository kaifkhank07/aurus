import { ResidenceDetail } from "@/components/residences/ResidenceDetail";
import { staticResidenceDetail } from "@/data/residenceDetails";
import RelatedResidences from "@/components/residences/RelatedResidences";
import { exploreResidences } from "@/data/exploreResidences";

export function generateStaticParams() {
  return exploreResidences.items.map((item) => ({
    slug: item.href.replace("/residences/", ""),
  }));
}

export default async function ResidenceSlugPage() {
  return (
    <main>
      <ResidenceDetail data={staticResidenceDetail} />
      <RelatedResidences />
    </main>
  );
}