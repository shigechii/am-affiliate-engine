import "dotenv/config";
import {
  detectItemDeal,
  detectDealsFromItems,
  fetchAndDetectDeals,
} from "../src/lib/discount-detector";
import { Item, PriceHistoryRecord } from "../src/types/item";

async function testDiscountDetector() {
  console.log("=== Testing Discount Detector Module ===");

  const now = new Date();

  // Test Case 1: NEW_LOW and PRICE_DROP detection
  console.log("1. Testing NEW_LOW and PRICE_DROP detection...");
  const item1: Item = {
    id: "test_item_1",
    provider: "dmm",
    title: "テスト商品1",
    url: "https://example.com/item1",
    affiliateUrl: "https://example.com/item1?aff=1",
    imageUrl: "https://example.com/item1.jpg",
    currentPrice: 1000,
    listPrice: 2000,
    discountRate: 50,
    rating: 4.5,
    reviewCount: 10,
    createdAt: now,
    updatedAt: now,
  };

  const history1: Array<PriceHistoryRecord> = [
    {
      id: "h1",
      itemId: "test_item_1",
      price: 2000,
      recordedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
    {
      id: "h2",
      itemId: "test_item_1",
      price: 1500,
      recordedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
  ];

  const deal1 = detectItemDeal(item1, history1);
  if (!deal1) {
    throw new Error("Deal 1 should be detected!");
  }

  console.log(`- Detection types: ${deal1.detectionTypes.join(", ")}`);
  console.log(`- Reasons: ${deal1.reasons.join(" | ")}`);

  if (!deal1.detectionTypes.includes("NEW_LOW")) {
    throw new Error("Expected NEW_LOW detection type");
  }
  if (!deal1.detectionTypes.includes("MAJOR_DISCOUNT")) {
    throw new Error("Expected MAJOR_DISCOUNT detection type");
  }
  if (!deal1.detectionTypes.includes("PRICE_DROP")) {
    throw new Error("Expected PRICE_DROP detection type");
  }

  // Test Case 2: No deal when price increased
  console.log("2. Testing no deal when price increases...");
  const item2: Item = {
    ...item1,
    id: "test_item_2",
    currentPrice: 2500,
    listPrice: 2000,
    discountRate: 0,
  };

  const deal2 = detectItemDeal(item2, history1);
  console.log(`- Deal 2 result is null: ${deal2 === null}`);
  if (deal2 !== null) {
    throw new Error("Deal 2 should be null when price increases!");
  }

  // Test Case 3: Batch detection
  console.log("3. Testing detectDealsFromItems...");
  const historyMap = new Map<string, Array<PriceHistoryRecord>>();
  historyMap.set("test_item_1", history1);
  historyMap.set("test_item_2", history1);

  const deals = detectDealsFromItems([item1, item2], historyMap);
  console.log(`- Detected deals count: ${deals.length}`);
  if (deals.length !== 1) {
    throw new Error(`Expected 1 deal, got ${deals.length}`);
  }

  // Test Case 4: fetchAndDetectDeals fallback
  console.log("4. Testing fetchAndDetectDeals...");
  const fetchedDeals = await fetchAndDetectDeals();
  console.log(`- Fetched deals count: ${fetchedDeals.length}`);
  if (fetchedDeals.length > 0) {
    console.log(`- Sample deal title: ${fetchedDeals[0].item.title}`);
  }

  console.log("=== All Discount Detector Tests Passed Successfully ===");
}

testDiscountDetector().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
