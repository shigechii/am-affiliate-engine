import { db } from "@/db";
import { items, priceHistory } from "@/db/schema";
import {
  Item,
  GetItemsParams,
  GetItemsResult,
  SortOption,
  PriceHistoryRecord,
} from "@/types/item";
import { like, desc, asc, count, eq } from "drizzle-orm";

const SAMPLE_ITEMS: Array<Item> = [
  {
    id: "sample_dmm_001",
    provider: "dmm",
    title: "【50%OFF】サンプルDMM限定コミック全巻セット（特典付き）",
    url: "https://www.dmm.com/digital/book/sample_001",
    affiliateUrl: "https://al.dmm.com/?lurl=https%3A%2F%2Fwww.dmm.com%2Fdigital%2Fbook%2Fsample_001&af_id=sample-990",
    imageUrl: "https://pics.dmm.com/digital/book/sample_001/sample_001pl.jpg",
    currentPrice: 1490,
    listPrice: 2980,
    discountRate: 50,
    rating: 4.8,
    reviewCount: 128,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sample_dmm_002",
    provider: "dmm",
    title: "サンプルDMM動画プレミアムスターターパック 4Kリマスター版",
    url: "https://www.dmm.com/digital/video/sample_002",
    affiliateUrl: "https://al.dmm.com/?lurl=https%3A%2F%2Fwww.dmm.com%2Fdigital%2Fvideo%2Fsample_002&af_id=sample-990",
    imageUrl: "https://pics.dmm.com/digital/video/sample_002/sample_002pl.jpg",
    currentPrice: 980,
    listPrice: 1980,
    discountRate: 51,
    rating: 4.3,
    reviewCount: 45,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sample_dmm_003",
    provider: "dmm",
    title: "サンプル人気アニメBD-BOX 豪華限定版【過去最安値更新】",
    url: "https://www.dmm.com/mono/dvd/sample_003",
    affiliateUrl: "https://al.dmm.com/?lurl=https%3A%2F%2Fwww.dmm.com%2Fmono%2Fdvd%2Fsample_003&af_id=sample-990",
    imageUrl: "https://pics.dmm.com/mono/dvd/sample_003/sample_003pl.jpg",
    currentPrice: 8800,
    listPrice: 17600,
    discountRate: 50,
    rating: 4.9,
    reviewCount: 210,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sample_dmm_004",
    provider: "dmm",
    title: "サンプルPCゲーム・アドベンチャーエディション",
    url: "https://www.dmm.com/netgame/sample_004",
    affiliateUrl: "https://al.dmm.com/?lurl=https%3A%2F%2Fwww.dmm.com%2Fnetgame%2Fsample_004&af_id=sample-990",
    imageUrl: "https://pics.dmm.com/netgame/sample_004/sample_004pl.jpg",
    currentPrice: 2480,
    listPrice: 3980,
    discountRate: 38,
    rating: 4.1,
    reviewCount: 32,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function getItemById(id: string): Promise<Item | null> {
  try {
    const fetched = await db
      .select()
      .from(items)
      .where(eq(items.id, id))
      .limit(1);

    if (fetched.length > 0) {
      return fetched[0] as Item;
    }
  } catch {
    console.warn(`[Items Service] DB query failed for item ${id}. Fallback checking sample list.`);
  }

  const sampleMatch = SAMPLE_ITEMS.find((item) => item.id === id);
  return sampleMatch || null;
}

export async function getPriceHistoryByItemId(
  itemId: string
): Promise<Array<PriceHistoryRecord>> {
  try {
    const records = await db
      .select()
      .from(priceHistory)
      .where(eq(priceHistory.itemId, itemId))
      .orderBy(asc(priceHistory.recordedAt));

    if (records.length > 0) {
      return records as Array<PriceHistoryRecord>;
    }
  } catch {
    console.warn(
      `[Items Service] DB query failed for priceHistory of ${itemId}. Fallback generating sample history.`
    );
  }

  return generateSamplePriceHistory(itemId);
}

function generateSamplePriceHistory(itemId: string): Array<PriceHistoryRecord> {
  const item = SAMPLE_ITEMS.find((i) => i.id === itemId);
  const currentPrice = item?.currentPrice || 1980;
  const listPrice = item?.listPrice || 2980;

  const now = new Date();
  const history: Array<PriceHistoryRecord> = [];

  const points = [
    { daysAgo: 90, price: listPrice },
    { daysAgo: 60, price: listPrice },
    { daysAgo: 45, price: Math.round((listPrice + currentPrice) / 2) },
    { daysAgo: 30, price: listPrice },
    { daysAgo: 14, price: currentPrice },
    { daysAgo: 0, price: currentPrice },
  ];

  for (let i = 0; i < points.length; i++) {
    const pt = points[i];
    const date = new Date(now.getTime() - pt.daysAgo * 24 * 60 * 60 * 1000);
    history.push({
      id: `sample_ph_${itemId}_${i}`,
      itemId,
      price: pt.price,
      recordedAt: date,
    });
  }

  return history;
}

export async function getItems(params: GetItemsParams = {}): Promise<GetItemsResult> {

  const queryText = params.query?.trim() || "";
  const sort: SortOption = params.sort || "latest";
  const limit = params.limit || 24;
  const page = params.page || 1;
  const offset = (page - 1) * limit;

  try {
    const whereClause = queryText ? like(items.title, `%${queryText}%`) : undefined;

    let orderClause;
    switch (sort) {
      case "discount":
        orderClause = desc(items.discountRate);
        break;
      case "price_asc":
        orderClause = asc(items.currentPrice);
        break;
      case "price_desc":
        orderClause = desc(items.currentPrice);
        break;
      case "rating":
        orderClause = desc(items.rating);
        break;
      case "latest":
      default:
        orderClause = desc(items.updatedAt);
        break;
    }

    const fetchedItems = await db
      .select()
      .from(items)
      .where(whereClause)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    const totalCountResult = await db
      .select({ value: count() })
      .from(items)
      .where(whereClause);

    const totalCount = totalCountResult[0]?.value || 0;

    if (fetchedItems.length === 0 && totalCount === 0 && !queryText) {
      return getSampleResult(sort, page, limit);
    }

    return {
      items: fetchedItems as Array<Item>,
      totalCount,
      currentPage: page,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
    };
  } catch {
    console.warn("[Items Service] DB query unavailable or failed. Using fallback sample items.");
    return getSampleResult(sort, page, limit, queryText);
  }
}

function getSampleResult(
  sort: SortOption,
  page: number,
  limit: number,
  queryText = ""
): GetItemsResult {
  let filtered = [...SAMPLE_ITEMS];

  if (queryText) {
    filtered = filtered.filter((i) =>
      i.title.toLowerCase().includes(queryText.toLowerCase())
    );
  }

  filtered.sort((a, b) => {
    switch (sort) {
      case "discount":
        return (b.discountRate || 0) - (a.discountRate || 0);
      case "price_asc":
        return (a.currentPrice || 0) - (b.currentPrice || 0);
      case "price_desc":
        return (b.currentPrice || 0) - (a.currentPrice || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "latest":
      default:
        return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
  });

  const totalCount = filtered.length;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return {
    items: paginated,
    totalCount,
    currentPage: page,
    totalPages: Math.max(1, Math.ceil(totalCount / limit)),
  };
}
