import "dotenv/config";
import {
  fetchDmmItems,
  fetchDmmFloors,
  fetchDmmGenres,
} from "../src/lib/dmm/client";

async function testDmmClient() {
  console.log("=== Testing DMM API Client ===");

  console.log("1. Testing fetchDmmItems...");
  const itemsRes = await fetchDmmItems({ hits: 5 });
  console.log(`- Status: ${itemsRes.result.status}`);
  console.log(`- Items Count: ${itemsRes.result.items?.length || 0}`);

  console.log("2. Testing fetchDmmFloors...");
  const floorsRes = await fetchDmmFloors();
  console.log(`- Status: ${floorsRes.result.status}`);
  console.log(`- Sites Count: ${floorsRes.result.site?.length || 0}`);

  console.log("3. Testing fetchDmmGenres...");
  const genresRes = await fetchDmmGenres({ floor_id: "videoa" });
  console.log(`- Status: ${genresRes.result.status}`);
  console.log(`- Genres Count: ${genresRes.result.genre?.length || 0}`);

  console.log("=== All DMM Client Tests Passed Successfully ===");
}

testDmmClient().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
