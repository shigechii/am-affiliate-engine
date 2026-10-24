export interface DmmImageUrls {
  list?: string;
  small?: string;
  large?: string;
}

export interface DmmPrices {
  price?: string;
  list_price?: string;
  deliveries?: {
    delivery?: {
      type?: string;
      price?: string;
    }[];
  };
}

export interface DmmReview {
  count?: number;
  average?: string;
}

export interface DmmItem {
  content_id: string;
  title: string;
  URL: string;
  affiliateURL: string;
  imageURL?: DmmImageUrls;
  prices?: DmmPrices;
  review?: DmmReview;
  category_name?: string;
  floor_code?: string;
  service_code?: string;
  site_name?: string;
  [key: string]: unknown;
}

export interface DmmItemListResponse {
  request: {
    parameters: Record<string, string>;
  };
  result: {
    status: number;
    result_count: number;
    total_count: number;
    first_position: number;
    items?: DmmItem[];
  };
}
