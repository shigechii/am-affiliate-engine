import "dotenv/config";
import { getItems } from "../src/lib/items/service";

async function testItemsService() {
  console.log("=== Testing Items Service ===");

  console.log("1. Testing default getItems()...");
  const resultDefault = await getItems();
  console.log(`- Total count: ${resultDefault.totalCount}`);
  console.log(`- Items returned: ${resultDefault.items.length}`);

  console.log("2. Testing search query...");
  const resultSearch = await getItems({ query: "コミック" });
  console.log(`- Search 'コミック' returned: ${resultSearch.items.length} items`);

  console.log("3. Testing discount sorting...");
  const resultSort = await getItems({ sort: "discount" });
  console.log(
    `- Top discount rate: ${resultSort.items[0]?.discountRate || 0}%`
  );

  console.log("=== All Items Service Tests Passed ===");
}

testItemsService().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
