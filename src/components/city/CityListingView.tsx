import CityHero from "@/components/city/CityHero";
import CityResidenceContent from "@/components/city/CityResidenceContent";
import CityIntroduction from "@/components/city/CityIntroduction";
import CityFaq from "@/components/city/CityFaq";
import CityFooterLinks from "@/components/city/CityFooterLinks";
import CitySeoContent from "@/components/city/CitySeoContent";
import { getCityFooterColumns } from "@/lib/city-listing-helpers";
import { listingSeoContent, type LegacySeoPage } from "@/lib/legacy-seo";

export interface CityListingViewProps {
  citySlug: string;
  gender?: "girls" | "boys" | "co-ed" | string;
  localitySlug?: string;
  instituteSlug?: string;
  /** SEO copy carried over from the previous website for this URL */
  legacy?: LegacySeoPage;
  cityName?: string;
}

export async function CityListingView({
  citySlug,
  gender,
  localitySlug,
  instituteSlug,
  legacy,
  cityName,
}: CityListingViewProps) {
  const normCitySlug = (citySlug || "").toLowerCase().trim();
  const footer = await getCityFooterColumns(normCitySlug);
  const resolvedCityName = cityName || footer?.cityName || legacy?.cityName || "";
  const seo = listingSeoContent(legacy, resolvedCityName);

  return (
    <main>
      {/* City Hero: H1 + intro (page-specific when the old site had them) */}
      <CityHero
        citySlug={normCitySlug}
        cityName={resolvedCityName}
        heading={seo.h1}
        description={seo.intro}
      />

      {/* Dynamic Filter Bar & Residences Grid */}
      <CityResidenceContent
        citySlug={normCitySlug}
        gender={gender}
        localitySlug={localitySlug}
        instituteSlug={instituteSlug}
      />

      {/* Long-form SEO copy */}
      <CitySeoContent title={seo.bottomTitle} paragraphs={seo.bottomParagraphs} />

      {/* Dynamic City Introduction */}
      <CityIntroduction citySlug={normCitySlug} />

      {/* FAQs (page-specific when the old site had them) */}
      <CityFaq citySlug={normCitySlug} items={seo.faqs} heading="FAQs on Living at AURUS Life" />

      {/* SEO footer links, rendered on the server */}
      <CityFooterLinks
        citySlug={normCitySlug}
        columns={footer?.columns}
        cityName={resolvedCityName || undefined}
      />
    </main>
  );
}

export default CityListingView;
