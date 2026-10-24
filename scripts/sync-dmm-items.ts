import "dotenv/config";
import { fetchDmmItems } from "../src/lib/dmm/client";
import { db } from "../src/db";
import { items, priceHistory } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { DmmItem } from "../src/types/dmm";

async function syncDmmItems() {
  console.log("=== [DMM Item Sync Batch Started] ===");

  const hasDb = Boolean(process.env.DATABASE_URL);
  if (!hasDb) {
    console.warn(
      "[Sync Batch] DATABASE_URL is not set. Operating in dry-run (log-only) mode."
    );
  }

  try {
    const response = await fetchDmmItems({ hits: 50 });
    const fetchedItems: Array<DmmItem> = response.result.items || [];

    console.log(`[Sync Batch] Fetched ${fetchedItems.length} items from DMM API.`);

    let insertedCount = 0;
    let updatedCount = 0;
    let priceHistoryCount = 0;

    for (const dmmItem of fetchedItems) {
      const itemId = dmmItem.content_id;
      const title = dmmItem.title;
      const url = dmmItem.URL;
      const affiliateUrl = dmmItem.affiliateURL;
      const imageUrl =
        dmmItem.imageURL?.large ||
        dmmItem.imageURL?.list ||
        dmmItem.imageURL?.small ||
        null;

      const currentPrice = dmmItem.prices?.price
        ? parseInt(dmmItem.prices.price, 10)
        : null;
      const listPrice = dmmItem.prices?.list_price
        ? parseInt(dmmItem.prices.list_price, 10)
        : null;

      let discountRate = 0;
      if (currentPrice !== null && listPrice !== null && listPrice > 0) {
        discountRate = Math.max(
          0,
          Math.round(((listPrice - currentPrice) / listPrice) * 100)
        );
      }

      const rating = dmmItem.review?.average
        ? parseFloat(dmmItem.review.average)
        : null;
      const reviewCount = dmmItem.review?.count ?? null;

      if (!hasDb) {
        console.log(
          `[Dry-run Item] ID: ${itemId} | Price: ¥${currentPrice} (List: ¥${listPrice}, -${discountRate}%) | Title: ${title}`
        );
        insertedCount++;
        if (currentPrice !== null) priceHistoryCount++;
        continue;
      }

      // Check existing item in database
      const existingItems = await db
        .select()
        .from(items)
        .where(eq(items.id, itemId));

      const existing = existingItems[0];
      const now = new Date();

      if (!existing) {
        // Insert new item
        await db.insert(items).values({
          id: itemId,
          provider: "dmm",
          title,
          url,
          affiliateUrl,
          imageUrl,
          currentPrice,
          listPrice,
          discountRate,
          rating,
          reviewCount,
          rawData: dmmItem as unknown as Record<string, unknown>,
          createdAt: now,
          updatedAt: now,
        });
        insertedCount++;

        // Record initial price history
        if (currentPrice !== null) {
          await db.insert(priceHistory).values({
            itemId,
            price: currentPrice,
            recordedAt: now,
          });
          priceHistoryCount++;
        }
      } else {
        // Update existing item
        await db
          .update(items)
          .set({
            title,
            url,
            affiliateUrl,
            imageUrl,
            currentPrice,
            listPrice,
            discountRate,
            rating,
            reviewCount,
            rawData: dmmItem as unknown as Record<string, unknown>,
            updatedAt: now,
          })
          .where(eq(items.id, itemId));

        updatedCount++;

        // Record price history if price changed
        if (
          currentPrice !== null &&
          existing.currentPrice !== currentPrice
        ) {
          await db.insert(priceHistory).values({
            itemId,
            price: currentPrice,
            recordedAt: now,
          });
          priceHistoryCount++;
        }
      }
    }

    console.log("=== [DMM Item Sync Batch Summary] ===");
    console.log(`- Total Processed: ${fetchedItems.length}`);
    console.log(`- New Inserted:    ${insertedCount}`);
    console.log(`- Updated:         ${updatedCount}`);
    console.log(`- Price History:   ${priceHistoryCount}`);
    console.log("=== [Sync Batch Successfully Completed] ===");
  } catch (error) {
    console.error("[Sync Batch Error]:", error);
    process.exit(1);
  }
}

syncDmmItems();
