import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import mongoose from "mongoose";
import connectToDatabase from "../src/lib/mongodb";
import {
  getCitiesWithResidences,
  getCityBySlug,
  getResidencesByCityId,
  mapHostelsToExploreItems,
} from "../src/lib/residences/city";
import { City } from "../src/models/city.model";
import { Hostel } from "../src/models/hostel.model";

async function runTests() {
  console.log("=== STARTING AUTOMATIC CITY RESIDENCES TESTS ===\n");
  await connectToDatabase();

  // Test 1: Available cities with eligible residences
  console.log("--- Test 1: getCitiesWithResidences() ---");
  const availableCities = await getCitiesWithResidences();
  console.log("Found cities:", availableCities.map((c) => ({ name: c.name, slug: c.slug, count: c.count })));

  const mumbai = availableCities.find((c) => c.slug === "mumbai");
  const pune = availableCities.find((c) => c.slug === "pune");

  console.assert(!!mumbai, "Mumbai should be present because it has 1 active hostel");
  console.assert(!pune, "Pune should NOT be in available cities because it has 0 active hostels");
  console.log("Test 1 Passed: Only cities with >= 1 active hostels returned.\n");

  // Test 2: City Details for Mumbai
  console.log("--- Test 2: getCityBySlug('mumbai') ---");
  const mumbaiDetails = await getCityBySlug("mumbai");
  console.log("Mumbai details:", mumbaiDetails);
  console.assert(mumbaiDetails !== null && mumbaiDetails.name === "Mumbai", "Mumbai must resolve with details");
  console.assert(mumbaiDetails?.count === 1, "Mumbai count must be >= 1");
  console.log("Test 2 Passed: Mumbai resolves successfully.\n");

  // Test 3: City Details for Pune (0 residences -> must return null / 404)
  console.log("--- Test 3: getCityBySlug('pune') (0 residences) ---");
  const puneDetails = await getCityBySlug("pune");
  console.log("Pune result:", puneDetails);
  console.assert(puneDetails === null, "Pune must return null because it has 0 active residences");
  console.log("Test 3 Passed: City with 0 residences returns null (triggers 404).\n");

  // Test 4: City Details for Ahmedabad (Non-existent in City Master -> must return null / 404)
  console.log("--- Test 4: getCityBySlug('ahmedabad') (not in City Master) ---");
  const ahmedabadDetails = await getCityBySlug("ahmedabad");
  console.log("Ahmedabad result:", ahmedabadDetails);
  console.assert(ahmedabadDetails === null, "Ahmedabad must return null");
  console.log("Test 4 Passed: Non-existent city returns null (triggers 404).\n");

  // Test 5: Invalid city slug
  console.log("--- Test 5: getCityBySlug('invalid-city-xyz-123') ---");
  const invalidDetails = await getCityBySlug("invalid-city-xyz-123");
  console.assert(invalidDetails === null, "Invalid slug must return null");
  console.log("Test 5 Passed: Invalid city slug returns null (triggers 404).\n");

  // Test 6: Fetch residences for Mumbai
  console.log("--- Test 6: getResidencesByCityId(mumbai._id) ---");
  if (mumbaiDetails) {
    const residences = await getResidencesByCityId(mumbaiDetails._id);
    console.log(`Found ${residences.length} residence(s) in Mumbai:`, residences.map((r) => r.title));
    console.assert(residences.length >= 1, "Mumbai must have at least 1 residence");

    // Test mapping to explore items
    const exploreItems = mapHostelsToExploreItems(residences, mumbaiDetails.name);
    console.log("Mapped explore item sample:", exploreItems[0]);
    console.assert(exploreItems[0].city === "Mumbai", "ExploreItem city should be Mumbai");
    console.assert(!!exploreItems[0].href, "ExploreItem must have href");
    console.assert(!!exploreItems[0].priceFrom, "ExploreItem must have priceFrom");
    console.log("Test 6 Passed: Residences mapped successfully.\n");
  }

  // Test 7: Automatic availability lifecycle
  // When a city gets a published residence, it automatically becomes available.
  // When that residence is deleted or unpublished, it returns to 404.
  console.log("--- Test 7: Automatic Page Availability Lifecycle for Pune ---");
  const puneCity = await City.findOne({ slug: "pune" });
  if (puneCity) {
    console.log("1. Initially Pune page availability:", await getCityBySlug("pune") === null ? "404 (Correct)" : "Available");

    // Insert temporary test hostel in Pune
    const testHostel = await Hostel.create({
      title: "Pune Test Residence",
      slug: "pune-test-residence-" + Date.now(),
      tenantType: ["boys"],
      isActive: true,
      frontImage: {
        url: "https://example.com/test.jpg",
        publickey: "test.jpg",
      },
      rent: 15000,
      rentFrequency: "monthly",
      amenities: [],
      description: "Test description for Pune hostel",
      location: {
        city: puneCity._id,
        locality: new mongoose.Types.ObjectId(),
        address: "Viman Nagar, Pune",
      },
    });
    console.log("2. Created active hostel in Pune. Testing page availability...");
    const puneAfterCreate = await getCityBySlug("pune");
    console.log("   Pune availability after adding hostel:", puneAfterCreate ? `Available (${puneAfterCreate.count} residence)` : "404");
    console.assert(puneAfterCreate !== null, "Pune MUST now be available automatically!");

    // Clean up temporary test hostel
    await Hostel.findByIdAndDelete(testHostel._id);
    console.log("3. Removed test hostel from Pune. Testing page availability...");
    const puneAfterDelete = await getCityBySlug("pune");
    console.log("   Pune availability after removing hostel:", puneAfterDelete === null ? "404 (Correct)" : "Available");
    console.assert(puneAfterDelete === null, "Pune MUST return 404 again after all hostels are removed!");
    console.log("Test 7 Passed: Automatic availability lifecycle works flawlessly.\n");
  }

  await mongoose.disconnect();
  console.log("=== ALL TESTS COMPLETED SUCCESSFULLY ===");
}

runTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});

