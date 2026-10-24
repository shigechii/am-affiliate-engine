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

export interface DmmItemInfoDetail {
  id: number | string;
  name: string;
}

export interface DmmIteminfo {
  genre?: DmmItemInfoDetail[];
  maker?: DmmItemInfoDetail[];
  actress?: DmmItemInfoDetail[];
  author?: DmmItemInfoDetail[];
  label?: DmmItemInfoDetail[];
  series?: DmmItemInfoDetail[];
  director?: DmmItemInfoDetail[];
  keyword?: DmmItemInfoDetail[];
}

export interface DmmItem {
  content_id: string;
  title: string;
  URL: string;
  affiliateURL: string;
  imageURL?: DmmImageUrls;
  prices?: DmmPrices;
  review?: DmmReview;
  iteminfo?: DmmIteminfo;
  category_name?: string;
  floor_code?: string;
  service_code?: string;
  site_name?: string;
  date?: string;
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

export interface DmmFloor {
  id: string;
  name: string;
  code: string;
}

export interface DmmService {
  id: string;
  name: string;
  code: string;
  floor?: DmmFloor[];
}

export interface DmmSite {
  name: string;
  code: string;
  service?: DmmService[];
}

export interface DmmFloorListResponse {
  request: {
    parameters: Record<string, string>;
  };
  result: {
    status: number;
    site?: DmmSite[];
  };
}

export interface DmmGenre {
  genre_id: number | string;
  name: string;
  ruby?: string;
  list_url?: string;
}

export interface DmmGenreListResponse {
  request: {
    parameters: Record<string, string>;
  };
  result: {
    status: number;
    result_count: number;
    total_count: number;
    first_position: number;
    genre?: DmmGenre[];
  };
}

