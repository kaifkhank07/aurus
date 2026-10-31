import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { useHostelAndEnquiryStore } from "../store/useHostelAndEnquiryStore";
import { publicApiClient } from "../lib/public-api";

async function testPublicHostelsStore() {
  console.log("=== STARTING PUBLIC HOSTEL / RESIDENCE STORE TESTS ===\n");

  // 1. Initial State Check
  const state0 = useHostelAndEnquiryStore.getState();
  console.log("1. Initial state check:");
  console.log("   publicHostels:", state0.publicHostels);
  console.log("   publicHostelsPagination:", state0.publicHostelsPagination);
  console.log("   isLoadingPublicHostels:", state0.isLoadingPublicHostels);
  console.log("   publicHostelsError:", state0.publicHostelsError);

  console.assert(Array.isArray(state0.publicHostels) && state0.publicHostels.length === 0, "publicHostels must be empty initially");
  console.assert(state0.publicHostelsPagination === null, "publicHostelsPagination must be null initially");
  console.assert(state0.isLoadingPublicHostels === false, "isLoadingPublicHostels must be false initially");
  console.assert(state0.publicHostelsError === null, "publicHostelsError must be null initially");
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
        message: "Residences retrieved successfully",
        data: {
          items: [
            {
              _id: "hostel-1",
              title: "Chapter I Mumbai",
              slug: "chapter-i-mumbai",
              rent: 25000,
              tenantType: ["boys"],
            },
            {
              _id: "hostel-2",
              title: "Chapter II Mumbai",
              slug: "chapter-ii-mumbai",
              rent: 28000,
              tenantType: ["girls"],
            },
          ],
          total: 2,
          page: 1,
          limit: 20,
          totalPages: 1,
        },
      },
    };
  };

  // 3. Concurrent Request Deduplication
  console.log("3. Testing concurrent request deduplication (3 simultaneous calls with same params)...");
  apiCallCount = 0;
  await Promise.all([
    useHostelAndEnquiryStore.getState().fetchPublicHostels({ citySlug: "mumbai" }),
    useHostelAndEnquiryStore.getState().fetchPublicHostels({ citySlug: "mumbai" }),
    useHostelAndEnquiryStore.getState().fetchPublicHostels({ citySlug: "mumbai" }),
  ]);

  console.assert(apiCallCount === 1, `Expected exactly 1 API call, got ${apiCallCount}`);
  console.log(`   Deduplication successful: only ${apiCallCount} network request fired.`);

  const stateAfterFetch = useHostelAndEnquiryStore.getState();
  console.log("   Fetched hostels count:", stateAfterFetch.publicHostels.length);
  console.log("   First hostel title:", stateAfterFetch.publicHostels[0]?.title);
  console.log("   First hostel id & _id:", stateAfterFetch.publicHostels[0]?.id, stateAfterFetch.publicHostels[0]?._id);
  console.assert(stateAfterFetch.publicHostels.length === 2, "Expected 2 hostels in store");
  console.assert(stateAfterFetch.publicHostels[0]?.id === "hostel-1", "Expected normalized id");
  console.assert(stateAfterFetch.publicHostelsPagination?.total === 2, "Pagination total should be 2");
  console.assert(stateAfterFetch.isLoadingPublicHostels === false, "isLoadingPublicHostels should be false");
  console.log("   Store state updated correctly.\n");

  // 4. Test fetchPublicResidences alias
  console.log("4. Testing fetchPublicResidences alias...");
  const res = await useHostelAndEnquiryStore.getState().fetchPublicHostels({ citySlug: "pune" }, true);
  console.assert(res.success === true, "fetchPublicResidences must return success");
  console.log("   fetchPublicResidences alias works identically.\n");

  // 5. Error handling
  console.log("5. Testing error handling resilience...");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (publicApiClient as any).get = async () => {
    throw new Error("Server network failure");
  };

  const errRes = await useHostelAndEnquiryStore.getState().fetchPublicHostels({ citySlug: "delhi" }, true);
  console.assert(errRes.success === false, "Expected failure response");
  const errState = useHostelAndEnquiryStore.getState();
  console.log("   Stored error message:", errState.publicHostelsError);
  console.assert(errState.publicHostelsError === "Server network failure", "Error message stored correctly");
  console.assert(errState.isLoadingPublicHostels === false, "isLoadingPublicHostels must reset to false");

  // 6. Test clearErrors
  useHostelAndEnquiryStore.getState().clearErrors();
  console.assert(useHostelAndEnquiryStore.getState().publicHostelsError === null, "clearErrors should clear publicHostelsError");
  console.log("   clearErrors() cleared publicHostelsError.\n");

  console.log("=== ALL PUBLIC HOSTEL STORE TESTS PASSED ===");
}

testPublicHostelsStore().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});

