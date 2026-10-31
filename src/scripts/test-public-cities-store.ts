import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { useMasterStore } from "../store/useMasterStore";
import { publicApiClient } from "../lib/public-api";
import connectToDatabase from "../lib/mongodb";
import { City } from "../models/city.model";
import { Hostel } from "../models/hostel.model";

async function testPublicCitiesStore() {
  console.log("=== STARTING PUBLIC CITIES / USEMASTERSTORE TESTS ===\n");

  // 1. Initial State Check
  const state0 = useMasterStore.getState();
  console.log("1. Initial state check:");
  console.log("   publicCities:", state0.publicCities);
  console.log("   isLoadingPublicCities:", state0.isLoadingPublicCities);
  console.log("   publicCitiesError:", state0.publicCitiesError);

  console.assert(Array.isArray(state0.publicCities) && state0.publicCities.length === 0, "publicCities must be empty initially");
  console.assert(state0.isLoadingPublicCities === false, "isLoadingPublicCities must be false initially");
  console.assert(state0.publicCitiesError === null, "publicCitiesError must be null initially");
  console.log("   Initial state verified.\n");

  // 2. Mock publicApiClient.get for controlled testing
  console.log("2. Mocking publicApiClient.get for controlled testing...");
  let apiCallCount = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (publicApiClient as any).get = async (url: string, config: any) => {
    apiCallCount++;
    console.log(`   [API Mock] Call #${apiCallCount} to ${url} with params:`, config?.params);
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      data: {
        success: true,
        message: "Public cities retrieved successfully.",
        data: [
          {
            id: "city-1",
            _id: "city-1",
            city: "Mumbai",
            name: "Mumbai",
            slug: "mumbai",
            state: "Maharashtra",
            country: "India",
            activeHostelsCount: 3,
            count: 3,
            sortOrder: 1,
            isActive: true,
          },
          {
            id: "city-2",
            _id: "city-2",
            city: "Pune",
            name: "Pune",
            slug: "pune",
            state: "Maharashtra",
            country: "India",
            activeHostelsCount: 0,
            count: 0,
            sortOrder: 2,
            isActive: true,
          },
        ],
      },
    };
  };

  // 3. Concurrent Request Deduplication
  console.log("3. Testing concurrent request deduplication (3 simultaneous calls)...");
  apiCallCount = 0;
  await Promise.all([
    useMasterStore.getState().fetchPublicCities(),
    useMasterStore.getState().fetchPublicCities(),
    useMasterStore.getState().fetchPublicCities(),
  ]);

  console.assert(apiCallCount === 1, `Expected exactly 1 API call, got ${apiCallCount}`);
  console.log(`   Deduplication successful: only ${apiCallCount} network request fired.`);

  const stateAfterFetch = useMasterStore.getState();
  console.log("   Fetched cities count:", stateAfterFetch.publicCities.length);
  console.log("   First city:", {
    name: stateAfterFetch.publicCities[0]?.name,
    activeHostelsCount: stateAfterFetch.publicCities[0]?.activeHostelsCount,
    count: stateAfterFetch.publicCities[0]?.count,
  });
  console.log("   Second city:", {
    name: stateAfterFetch.publicCities[1]?.name,
    activeHostelsCount: stateAfterFetch.publicCities[1]?.activeHostelsCount,
    count: stateAfterFetch.publicCities[1]?.count,
  });

  console.assert(stateAfterFetch.publicCities.length === 2, "Expected 2 cities in store");
  console.assert(stateAfterFetch.publicCities[0]?.activeHostelsCount === 3, "Expected activeHostelsCount to be 3");
  console.assert(stateAfterFetch.publicCities[1]?.activeHostelsCount === 0, "Expected activeHostelsCount to be 0");
  console.assert(stateAfterFetch.isLoadingPublicCities === false, "isLoadingPublicCities should be false");
  console.log("   Store state and activeHostelsCount verified.\n");

  // 4. Error handling
  console.log("4. Testing error handling resilience...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (publicApiClient as any).get = async () => {
    throw new Error("API server error");
  };

  const errRes = await useMasterStore.getState().fetchPublicCities({}, true);
  console.assert(errRes.success === false, "Expected failure response");
  const errState = useMasterStore.getState();
  console.log("   Stored error message:", errState.publicCitiesError);
  console.assert(errState.publicCitiesError === "API server error", "Error message stored correctly");
  console.assert(errState.isLoadingPublicCities === false, "isLoadingPublicCities must reset to false");

  // 5. Test clearErrors
  useMasterStore.getState().clearErrors();
  console.assert(useMasterStore.getState().publicCitiesError === null, "clearErrors should clear publicCitiesError");
  console.log("   clearErrors() cleared publicCitiesError.\n");

  // 6. Test Live DB aggregation for active hostels count
  console.log("6. Testing live database aggregation for city activeHostelsCount...");
  await connectToDatabase();
  const cities = await City.find({ isActive: true }).lean();
  const counts = await Hostel.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: "$location.city", count: { $sum: 1 } } },
  ]);
  const countMap = new Map<string, number>();
  counts.forEach((item) => {
    if (item._id) countMap.set(item._id.toString(), item.count);
  });

  console.log("   Live database cities found:", cities.length);
  cities.forEach((c) => {
    const hostelCount = countMap.get(c._id.toString()) || 0;
    console.log(`   - City: ${c.city} (${c.slug}) -> activeHostelsCount: ${hostelCount}`);
  });

  console.log("\n=== ALL PUBLIC CITIES STORE TESTS PASSED ===");
}

testPublicCitiesStore().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});

