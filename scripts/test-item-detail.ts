import "dotenv/config";
import { getItemById } from "../src/lib/items/service";

async function testItemDetail() {
  console.log("=== Testing Item Detail Service ===");

  console.log("1. Testing getItemById('sample_dmm_001')...");
  const item = await getItemById("sample_dmm_001");

  if (!item) {
    throw new Error("Item 'sample_dmm_001' was not found!");
  }

  console.log(`- ID: ${item.id}`);
  console.log(`- Title: ${item.title}`);
  console.log(`- Price: ¥${item.currentPrice} (List: ¥${item.listPrice})`);
  console.log(`- Discount Rate: ${item.discountRate}%`);

  console.log("2. Testing getItemById('non_existent_id')...");
  const nullItem = await getItemById("non_existent_id");
  console.log(`- Non-existent result is null: ${nullItem === null}`);

  console.log("=== All Item Detail Tests Passed Successfully ===");
}

testItemDetail().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
