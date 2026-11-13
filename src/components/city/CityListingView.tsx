import CityHero from "@/components/city/CityHero";
import CityResidenceContent from "@/components/city/CityResidenceContent";
import CityIntroduction from "@/components/city/CityIntroduction";
import CityFaq from "@/components/city/CityFaq";
import CityFooterLinks from "@/components/city/CityFooterLinks";

export interface CityListingViewProps {
  citySlug: string;
  gender?: "girls" | "boys" | "co-ed" | string;
  localitySlug?: string;
  instituteSlug?: string;
}

export function CityListingView({
  citySlug,
  gender,
  localitySlug,
  instituteSlug,
}: CityListingViewProps) {
  return (
    <main>
      {/* Dynamic City Hero */}
      <CityHero citySlug={citySlug} />

      {/* Dynamic Filter Bar & Residences Grid */}
      <CityResidenceContent
        citySlug={citySlug}
        gender={gender}
        localitySlug={localitySlug}
        instituteSlug={instituteSlug}
      />

      {/* Dynamic City Introduction */}
      <CityIntroduction citySlug={citySlug} />

      {/* Dynamic City FAQ */}
      <CityFaq citySlug={citySlug} />

      {/* Dynamic City Footer Links */}
      <CityFooterLinks citySlug={citySlug} />
    </main>
  );
}

export default CityListingView;

