export interface FooterLinkItem {
  label: string;
  href: string;
}

export interface FooterLinkColumn {
  title: string;
  links: FooterLinkItem[];
}

export interface CityLocalityInput {
  name: string;
  slug: string;
}

export interface CityCollegeInput {
  name: string;
  slug: string;
  locality?: string;
  localitySlug?: string;
}

/**
 * Generate Column 1: PG in City
 */
export function generateCityPgLinks(cityName: string, citySlug: string): FooterLinkItem[] {
  return [
    {
      label: `PG in ${cityName}`,
      href: `/pg-listing/${citySlug}`,
    },
    {
      label: `Girls PG in ${cityName}`,
      href: `/girls-pg-listing/${citySlug}`,
    },
    {
      label: `Boys PG in ${cityName}`,
      href: `/boys-pg-listing/${citySlug}`,
    },
  ];
}

/**
 * Generate Column 2: Hostels in City
 */
export function generateCityHostelLinks(cityName: string, citySlug: string): FooterLinkItem[] {
  return [
    {
      label: `Hostels in ${cityName}`,
      href: `/hostels/${citySlug}`,
    },
    {
      label: `Girls Hostels in ${cityName}`,
      href: `/girls-hostel-listing/${citySlug}`,
    },
    {
      label: `Boys Hostels in ${cityName}`,
      href: `/boys-hostel-listing/${citySlug}`,
    },
  ];
}

/**
 * Generate Column 3: PG Near You (returns empty if no localities exist for this city)
 */
export function generateLocalityPgLinks(
  citySlug: string,
  localities?: Array<{ name: string; slug: string }>
): FooterLinkItem[] {
  if (!localities || localities.length === 0) return [];
  return localities.flatMap((loc) => [
    {
      label: `PG near ${loc.name}`,
      href: `/pg-listing/${citySlug}/${loc.slug}`,
    },
    {
      label: `Girls PG near ${loc.name}`,
      href: `/girls-pg-listing/${citySlug}/${loc.slug}`,
    },
    {
      label: `Boys PG near ${loc.name}`,
      href: `/boys-pg-listing/${citySlug}/${loc.slug}`,
    },
  ]);
}

/**
 * Generate Column 4: Hostels Near You (returns empty if no localities exist for this city)
 */
export function generateLocalityHostelLinks(
  citySlug: string,
  localities?: Array<{ name: string; slug: string }>
): FooterLinkItem[] {
  if (!localities || localities.length === 0) return [];
  return localities.flatMap((loc) => [
    {
      label: `Hostel near ${loc.name}`,
      href: `/hostel-listing/${citySlug}/${loc.slug}`,
    },
    {
      label: `Girls Hostel near ${loc.name}`,
      href: `/girls-hostel-listing/${citySlug}/${loc.slug}`,
    },
    {
      label: `Boys Hostel near ${loc.name}`,
      href: `/boys-hostel-listing/${citySlug}/${loc.slug}`,
    },
  ]);
}

/**
 * Generate Column 5: Hostels Near Your College (returns empty if no colleges exist for this city)
 */
export function generateCollegeLinks(
  citySlug: string,
  colleges?: Array<{ name: string; slug: string; locality?: string; localitySlug?: string }>
): FooterLinkItem[] {
  if (!colleges || colleges.length === 0) return [];
  return colleges.flatMap((col) => {
    const localitySuffix = col.locality ? ` ${col.locality}` : "";
    const hrefLocality = col.localitySlug ? `/${col.localitySlug}` : "";
    return [
      {
        label: `PG near ${col.name}${localitySuffix}`,
        href: `/pg-listing/${citySlug}${hrefLocality}/${col.slug}`,
      },
      {
        label: `Hostel near ${col.name}${localitySuffix}`,
        href: `/hostel-listing/${citySlug}${hrefLocality}/${col.slug}`,
      },
    ];
  });
}

/**
 * Assemble columns for City SEO footer links.
 * Only includes locality/college columns if active entries exist for this specific city.
 * Never displays default or other cities' localities or institutes.
 */
export function generateCityFooterLinkColumns(
  cityName: string,
  citySlug: string,
  localities?: Array<{ name: string; slug: string }>,
  colleges?: Array<{ name: string; slug: string; locality?: string; localitySlug?: string }>
): FooterLinkColumn[] {
  const columns: FooterLinkColumn[] = [
    {
      title: `PG in ${cityName}`,
      links: generateCityPgLinks(cityName, citySlug),
    },
    {
      title: `Hostels in ${cityName}`,
      links: generateCityHostelLinks(cityName, citySlug),
    },
  ];

  const localityPgLinks = generateLocalityPgLinks(citySlug, localities);
  if (localityPgLinks.length > 0) {
    columns.push({
      title: "PG Near You",
      links: localityPgLinks,
    });
  }

  const localityHostelLinks = generateLocalityHostelLinks(citySlug, localities);
  if (localityHostelLinks.length > 0) {
    columns.push({
      title: "Hostels Near You",
      links: localityHostelLinks,
    });
  }

  const collegeLinks = generateCollegeLinks(citySlug, colleges);
  if (collegeLinks.length > 0) {
    columns.push({
      title: "Hostels near your college",
      links: collegeLinks,
    });
  }

  return columns;
}
