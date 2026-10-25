import "dotenv/config";
import { getPriceHistoryByItemId } from "../src/lib/items/service";

async function testPriceHistory() {
  console.log("=== Testing Price History Service ===");

  console.log("1. Testing getPriceHistoryByItemId('sample_dmm_001')...");
  const history = await getPriceHistoryByItemId("sample_dmm_001");

  console.log(`- History Records Count: ${history.length}`);
  if (history.length > 0) {
    console.log(`- First Record Price: ¥${history[0].price}`);
    console.log(`- Latest Record Price: ¥${history[history.length - 1].price}`);
  }

  if (history.length === 0) {
    throw new Error("Price history array should not be empty!");
  }

  console.log("=== All Price History Tests Passed Successfully ===");
}

testPriceHistory().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
