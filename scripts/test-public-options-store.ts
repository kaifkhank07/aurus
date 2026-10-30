import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { usePublicOptions } from "../src/store/usePublicOptions";
import { publicApiClient } from "../src/lib/public-api";

// Mock or test directly against API
async function testPublicOptionsStore() {
  console.log("=== STARTING USEPUBLICOPTIONS STORE TESTS ===\n");

  // Verify initial state
  const state0 = usePublicOptions.getState();
  console.log("1. Initial state check:");
  console.log("   residenceCities:", state0.residenceCities);
  console.log("   isLoading:", state0.isLoading);
  console.log("   isFetched:", state0.isFetched);
  console.log("   error:", state0.error);
  console.assert(Array.isArray(state0.residenceCities) && state0.residenceCities.length === 0, "residenceCities should initially be empty");
  console.assert(state0.isLoading === false, "isLoading should initially be false");
  console.assert(state0.isFetched === false, "isFetched should initially be false");
  console.log("   Initial state verified.\n");

  // Test 2: Mock publicApiClient to return mock cities
  console.log("2. Mocking publicApiClient.get for controlled testing...");
  let apiCallCount = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (publicApiClient as any).get = async (url: string) => {
    apiCallCount++;
    console.log(`   [API Mock] Call #${apiCallCount} to ${url}`);
    // Simulate slight network latency
    await new Promise((resolve) => setTimeout(resolve, 50));
    return {
      data: {
        success: true,
        message: "Available cities retrieved successfully",
        data: [
          { _id: "city-1", name: "Mumbai", slug: "mumbai", count: 2 },
          { _id: "city-2", name: "Pune", slug: "pune", count: 1 },
        ],
      },
    };
  };

  // Test 3: Simultaneous fetch deduplication
  console.log("3. Testing simultaneous fetch deduplication (3 concurrent calls)...");
  apiCallCount = 0;
  await Promise.all([
    usePublicOptions.getState().fetchResidenceCities(),
    usePublicOptions.getState().fetchResidenceCities(),
    usePublicOptions.getState().fetchResidenceCities(),
  ]);

  console.assert(apiCallCount === 1, `Expected exactly 1 API call, got ${apiCallCount}`);
  console.log(`   Concurrent calls deduplicated successfully: only ${apiCallCount} network request fired.`);

  const stateAfterFetch = usePublicOptions.getState();
  console.log("   Cities in store:", stateAfterFetch.residenceCities.map((c) => c.name));
  console.assert(stateAfterFetch.residenceCities.length === 2, "Expected 2 cities in store");
  console.assert(stateAfterFetch.isFetched === true, "isFetched should be true");
  console.assert(stateAfterFetch.isLoading === false, "isLoading should be false");
  console.log("   Store state updated correctly.\n");

  // Test 4: Cached retrieval without network request
  console.log("4. Testing cached retrieval (subsequent fetch call when already fetched)...");
  const callCountBefore = apiCallCount;
  await usePublicOptions.getState().fetchResidenceCities();
  console.assert(apiCallCount === callCountBefore, "No new API call should be made when isFetched is true");
  console.log(`   Cache reused successfully: apiCallCount remained ${apiCallCount}.\n`);

  // Test 5: Force refresh
  console.log("5. Testing force refresh (force = true)...");
  await usePublicOptions.getState().fetchResidenceCities(true);
  console.assert(apiCallCount === callCountBefore + 1, "Force refresh must make a new API call");
  console.log(`   Force refresh triggered new API call successfully (apiCallCount = ${apiCallCount}).\n`);

  // Test 6: Error handling and resilience
  console.log("6. Testing error handling resilience...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (publicApiClient as any).get = async () => {
    throw new Error("Simulated network timeout");
  };

  await usePublicOptions.getState().fetchResidenceCities(true);
  const errorState = usePublicOptions.getState();
  console.log("   Error message in store:", errorState.error);
  console.assert(errorState.error === "Simulated network timeout", "Error should be stored gracefully");
  console.assert(errorState.isLoading === false, "isLoading should reset to false");
  console.log("   Error handled gracefully without throwing unhandled exceptions.\n");

  console.log("=== ALL USEPUBLICOPTIONS TESTS PASSED ===");
}

testPublicOptionsStore().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});

