import { getHostelBySlug, getRelatedHostels } from "@/lib/residences/detail";

async function runTest() {
  console.log("=== Testing Dynamic Residence Slug Data Fetching & Mapping ===");

  const slugs = [
    "chapter-i-residences-for-girls",
    "chapter-ii-residences-for-girls",
    "chapter-iii-residences-for-boys",
  ];

  for (const slug of slugs) {
    console.log(`\n--- Fetching slug: "${slug}" ---`);
    const result = await getHostelBySlug(slug);

    if (!result) {
      throw new Error(`Failed to find hostel by slug "${slug}"!`);
    }

    const { residenceDetail, raw } = result;
    console.log(`Found: "${residenceDetail.title}" (Subtitle: "${residenceDetail.subtitle}")`);
    console.log(`Gender Badge: "${residenceDetail.genderBadge}"`);
    console.log(`Location Badge: "${residenceDetail.locationBadge}"`);
    console.log(`Main Image: "${residenceDetail.mainImage}"`);
    console.log(`Gallery Images Count: ${residenceDetail.galleryImages.length}`);
    console.log(`Starts From: ${residenceDetail.pricing.startsFrom} ${residenceDetail.pricing.period}`);
    console.log(`Included Amenities Count: ${residenceDetail.includedInStay.length}`);
    console.log(`Near Campus Distance: "${residenceDetail.nearCampus.distance}"`);
    console.log(`Location Address: "${residenceDetail.location.address}"`);

    // Verify related hostels
    const related = await getRelatedHostels(raw._id.toString(), raw.location?.city?._id);
    console.log(`Related Hostels Count: ${related.length}`);
    related.forEach((r) => {
      console.log(` - Related: ${r.name} (${r.priceFrom}) -> ${r.href}`);
    });

    if (related.some((r) => r.slug === slug)) {
      throw new Error(`Current hostel "${slug}" was included in its own related items!`);
    }
  }

  console.log("\n=== ALL RESIDENCE DETAIL TESTS PASSED SUCCESSFULLY ===");
  process.exit(0);
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

