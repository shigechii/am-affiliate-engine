import { db } from "@/db";
import { items, priceHistory } from "@/db/schema";
import { Item, PriceHistoryRecord } from "@/types/item";
import { eq, asc, desc } from "drizzle-orm";

export type DetectionType = "NEW_LOW" | "MAJOR_DISCOUNT" | "PRICE_DROP";

export interface DetectedDeal {
  item: Item;
  previousPrice: number | null;
  historicalMinPrice: number | null;
  priceDiff: number | null;
  detectionTypes: Array<DetectionType>;
  reasons: Array<string>;
}

export interface DetectorOptions {
  /** Minimum discount rate percentage (e.g., 20 for 20% OFF). Default: 20 */
  minDiscountRate?: number;
  /** Minimum price drop amount in JPY. Default: 100 */
  minPriceDropAmount?: number;
  /** Require new historical lowest price. Default: false */
  requireNewLow?: boolean;
}

const DEFAULT_OPTIONS: Required<DetectorOptions> = {
  minDiscountRate: 20,
  minPriceDropAmount: 100,
  requireNewLow: false,
};

/**
 * Evaluates a single item and its price history to detect sales or price drops.
 */
export function detectItemDeal(
  item: Item,
  history: Array<PriceHistoryRecord>,
  options: DetectorOptions = {}
): DetectedDeal | null {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const currentPrice = item.currentPrice;

  if (currentPrice === null || currentPrice <= 0) {
    return null;
  }

  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
  );

  const previousRecords = sortedHistory.filter(
    (h) => new Date(h.recordedAt).getTime() < new Date(item.updatedAt).getTime()
  );

  const previousRecord =
    previousRecords.length > 0
      ? previousRecords[previousRecords.length - 1]
      : sortedHistory.length > 1
        ? sortedHistory[sortedHistory.length - 2]
        : null;

  const previousPrice = previousRecord ? previousRecord.price : null;

  const historicalPrices = previousRecords.map((h) => h.price);
  const historicalMinPrice =
    historicalPrices.length > 0 ? Math.min(...historicalPrices) : null;

  const detectionTypes: Array<DetectionType> = [];
  const reasons: Array<string> = [];

  // 1. Check for New Historical Lowest Price (NEW_LOW)
  if (historicalMinPrice !== null && currentPrice < historicalMinPrice) {
    detectionTypes.push("NEW_LOW");
    reasons.push(
      `過去最安値を更新 (旧最安値: ¥${historicalMinPrice.toLocaleString()} → 現在: ¥${currentPrice.toLocaleString()})`
    );
  }

  // 2. Check for Major Discount Rate (MAJOR_DISCOUNT)
  if (
    item.discountRate !== null &&
    item.discountRate >= mergedOptions.minDiscountRate
  ) {
    detectionTypes.push("MAJOR_DISCOUNT");
    reasons.push(`${item.discountRate}% OFF セール開催中`);
  }

  // 3. Check for Price Drop vs Previous Price (PRICE_DROP)
  if (previousPrice !== null && currentPrice < previousPrice) {
    const priceDiff = previousPrice - currentPrice;
    if (priceDiff >= mergedOptions.minPriceDropAmount) {
      detectionTypes.push("PRICE_DROP");
      reasons.push(
        `前回比 ¥${priceDiff.toLocaleString()} 値下げ (前: ¥${previousPrice.toLocaleString()} → 現在: ¥${currentPrice.toLocaleString()})`
      );
    }
  }

  if (detectionTypes.length === 0) {
    return null;
  }

  if (mergedOptions.requireNewLow && !detectionTypes.includes("NEW_LOW")) {
    return null;
  }

  const priceDiff = previousPrice !== null ? previousPrice - currentPrice : null;

  return {
    item,
    previousPrice,
    historicalMinPrice,
    priceDiff,
    detectionTypes,
    reasons,
  };
}


/**
 * Evaluates multiple items against a map of price histories.
 */
export function detectDealsFromItems(
  itemsList: Array<Item>,
  historyMap: Map<string, Array<PriceHistoryRecord>>,
  options: DetectorOptions = {}
): Array<DetectedDeal> {
  const deals: Array<DetectedDeal> = [];

  for (const item of itemsList) {
    const history = historyMap.get(item.id) || [];
    const deal = detectItemDeal(item, history, options);
    if (deal) {
      deals.push(deal);
    }
  }

  return deals;
}

/**
 * Fetches items and price histories from DB (or sample data fallback)
 * and returns all detected deals meeting specified options.
 */
export async function fetchAndDetectDeals(
  options: DetectorOptions = {}
): Promise<Array<DetectedDeal>> {
  try {
    const dbItems = await db.select().from(items).orderBy(desc(items.updatedAt));

    if (dbItems.length > 0) {
      const historyMap = new Map<string, Array<PriceHistoryRecord>>();

      for (const dbItem of dbItems) {
        const records = await db
          .select()
          .from(priceHistory)
          .where(eq(priceHistory.itemId, dbItem.id))
          .orderBy(asc(priceHistory.recordedAt));

        historyMap.set(dbItem.id, records as Array<PriceHistoryRecord>);
      }

      return detectDealsFromItems(
        dbItems as Array<Item>,
        historyMap,
        options
      );
    }
  } catch {
    console.warn(
      "[Discount Detector] DB query failed or unavailable. Operating with sample evaluation data."
    );
  }

  return getSampleDetectedDeals(options);
}

function getSampleDetectedDeals(options: DetectorOptions): Array<DetectedDeal> {
  const sampleNow = new Date();
  const sampleItem1: Item = {
    id: "sample_deal_001",
    provider: "dmm",
    title: "【過去最安値更新】サンプルDMM話題作コミック全巻セット",
    url: "https://www.dmm.com/digital/book/sample_deal_001",
    affiliateUrl: "https://al.dmm.com/?lurl=sample_deal_001&af_id=sample-990",
    imageUrl: "https://pics.dmm.com/sample_deal_001.jpg",
    currentPrice: 980,
    listPrice: 2980,
    discountRate: 67,
    rating: 4.8,
    reviewCount: 150,
    createdAt: sampleNow,
    updatedAt: sampleNow,
  };

  const sampleHistory1: Array<PriceHistoryRecord> = [
    {
      id: "ph_1",
      itemId: "sample_deal_001",
      price: 2980,
      recordedAt: new Date(sampleNow.getTime() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ph_2",
      itemId: "sample_deal_001",
      price: 1980,
      recordedAt: new Date(sampleNow.getTime() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      id: "ph_3",
      itemId: "sample_deal_001",
      price: 980,
      recordedAt: sampleNow,
    },
  ];

  const deal = detectItemDeal(sampleItem1, sampleHistory1, options);
  return deal ? [deal] : [];
}
