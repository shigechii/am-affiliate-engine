export interface Item {
  id: string;
  provider: string;
  title: string;
  url: string;
  affiliateUrl: string;
  imageUrl: string | null;
  currentPrice: number | null;
  listPrice: number | null;
  discountRate: number | null;
  rating: number | null;
  reviewCount: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export type SortOption = "discount" | "price_asc" | "price_desc" | "rating" | "latest";

export interface GetItemsParams {
  query?: string;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

export interface GetItemsResult {
  items: Array<Item>;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
