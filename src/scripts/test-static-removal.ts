import * as residenceDetails from "@/data/residences/residenceDetails";
import * as exploreResidences from "@/data/residences/exploreResidences";
import { getHostelBySlug } from "@/lib/residences/detail";

async function verify() {
  console.log("=== Verifying Static Data Removal ===");

  // 1. Verify staticResidenceDetail is completely gone
  if ("staticResidenceDetail" in residenceDetails) {
    throw new Error("staticResidenceDetail still exists in residenceDetails.ts!");
  }
  console.log("Passed: staticResidenceDetail is completely removed from residenceDetails.ts");

  // 2. Verify static options and items are gone from exploreResidences
  const expObj = exploreResidences.exploreResidences as any;
  const forbiddenProperties = ["items", "cities", "genderWings", "occupancies"];
  for (const prop of forbiddenProperties) {
    if (prop in expObj) {
      throw new Error(`Static property "${prop}" still exists in exploreResidences!`);
    }
  }
  console.log("Passed: All static items, cities, genderWings, and occupancies are removed from exploreResidences.ts");

  // 3. Verify dynamic hostel retrieval
  const dynamicHostel = await getHostelBySlug("chapter-i-residences-for-girls");
  if (!dynamicHostel || !dynamicHostel.residenceDetail) {
    throw new Error("Failed to load dynamic hostel data from database!");
  }
  console.log("Passed: Dynamic hostel successfully loaded from MongoDB:", dynamicHostel.residenceDetail.title);

  // 4. Verify invalid slug returns null (triggers 404)
  const invalid = await getHostelBySlug("non-existent-hostel-xyz-123");
  if (invalid !== null) {
    throw new Error("Invalid slug did not return null!");
  }
  console.log("Passed: Non-existent slug correctly returns null");

  console.log("\n=== ALL STATIC DATA REMOVAL CHECKS PASSED ===");
  process.exit(0);
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});

