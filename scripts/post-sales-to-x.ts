import "dotenv/config";
import { fetchAndDetectDeals, DetectedDeal } from "../src/lib/discount-detector";
import { twitterClient } from "../src/lib/twitter/client";

async function postDealsToX() {
  console.log("=== [X Posting Script Started] ===");

  if (!process.env.X_API_KEY) {
    console.warn("[X Posting] X API credentials not found. Dry-run mode.");
  }

  const deals = await fetchAndDetectDeals({ minDiscountRate: 20 });
  console.log(`[X Posting] Detected ${deals.length} deals.`);

  for (const deal of deals) {
    const message = formatPost(deal);
    console.log(`[X Posting] Posting: ${message}`);

    if (process.env.X_API_KEY) {
      try {
        await twitterClient.v2.tweet(message);
        console.log("Successfully posted to X.");
      } catch (error) {
        console.error("Failed to post to X:", error);
      }
    }
  }

  console.log("=== [X Posting Script Finished] ===");
}

function formatPost(deal: DetectedDeal): string {
  const { item } = deal;
  const currentPrice = item.currentPrice ? `¥${item.currentPrice.toLocaleString()}` : "価格不明";
  const listPrice = item.listPrice ? `¥${item.listPrice.toLocaleString()}` : null;
  const siteUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://am-affiliate.com"}/items/${item.id}`;

  const lines = [
    `【${deal.detectionTypes.includes("NEW_LOW") ? "過去最安値" : "セール情報"}】`,
    item.title,
    `価格: ${currentPrice}${listPrice ? ` (定価: ${listPrice})` : ""}`,
    deal.reasons.join(" / "),
    `詳細はこちら: ${siteUrl}`,
    "#DMM #セール #最安値",
  ];

  return lines.join("\n");
}

postDealsToX();
