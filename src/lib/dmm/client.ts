import {
  DmmItemListResponse,
  DmmFloorListResponse,
  DmmGenreListResponse,
  DmmItem,
} from "@/types/dmm";

export interface FetchDmmItemsParams {
  site?: string;
  service?: string;
  floor?: string;
  hits?: number;
  offset?: number;
  sort?: string;
  keyword?: string;
  article?: string;
  article_id?: string;
}

export interface FetchDmmGenresParams {
  floor_id: string;
  hits?: number;
  offset?: number;
}

export interface DmmClientConfig {
  minIntervalMs?: number; // Rate limiter interval
  maxRetries?: number;    // Exponential backoff max retries
  baseDelayMs?: number;   // Exponential backoff base delay
}

const DEFAULT_CONFIG: Required<DmmClientConfig> = {
  minIntervalMs: 200,
  maxRetries: 3,
  baseDelayMs: 500,
};

/**
 * Simple rate limiter to enforce minimum time interval between HTTP requests.
 */
class RateLimiter {
  private lastRequestTime = 0;

  async throttle(minIntervalMs: number): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < minIntervalMs) {
      const waitTime = minIntervalMs - elapsed;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }
}

const rateLimiter = new RateLimiter();

/**
 * Fetch helper with rate limiting and exponential backoff retry.
 */
async function fetchWithRetry(
  url: string,
  config: Required<DmmClientConfig> = DEFAULT_CONFIG
): Promise<Response> {
  let attempt = 0;

  while (attempt <= config.maxRetries) {
    await rateLimiter.throttle(config.minIntervalMs);

    try {
      const response = await fetch(url);

      if (response.ok) {
        return response;
      }

      const isRetryable = response.status === 429 || response.status >= 500;
      if (!isRetryable || attempt === config.maxRetries) {
        throw new Error(
          `DMM API request failed with status: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      if (attempt === config.maxRetries) {
        throw error;
      }
      console.warn(
        `[DMM Client] Request failed (attempt ${attempt + 1}/${config.maxRetries + 1}). Retrying...`,
        error
      );
    }

    attempt++;
    const delay = config.baseDelayMs * Math.pow(2, attempt) + Math.random() * 100;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("[DMM Client] Maximum retries exceeded.");
}

/**
 * Fetch items from DMM Web Service API v3 (ItemList).
 */
export async function fetchDmmItems(
  params: FetchDmmItemsParams = {},
  clientConfig?: DmmClientConfig
): Promise<DmmItemListResponse> {
  const apiId = process.env.DMM_API_ID;
  const affiliateId = process.env.DMM_AFFILIATE_ID;

  if (!apiId || !affiliateId) {
    console.warn(
      "[DMM Client] DMM_API_ID or DMM_AFFILIATE_ID is not set. Returning sample mock items."
    );
    return getSampleDmmResponse();
  }

  const queryParams = new URLSearchParams({
    api_id: apiId,
    affiliate_id: affiliateId,
    site: params.site || "DMM.com",
    hits: String(params.hits || 20),
    offset: String(params.offset || 1),
    sort: params.sort || "rank",
    output: "json",
  });

  if (params.service) queryParams.set("service", params.service);
  if (params.floor) queryParams.set("floor", params.floor);
  if (params.keyword) queryParams.set("keyword", params.keyword);
  if (params.article) queryParams.set("article", params.article);
  if (params.article_id) queryParams.set("article_id", params.article_id);

  const url = `https://api.dmm.com/affiliate/v3/ItemList?${queryParams.toString()}`;
  const mergedConfig = { ...DEFAULT_CONFIG, ...clientConfig };

  const response = await fetchWithRetry(url, mergedConfig);
  const data: DmmItemListResponse = await response.json();

  if (data.result.status !== 200) {
    throw new Error(`DMM API returned error status: ${data.result.status}`);
  }

  return data;
}

/**
 * Fetch floor list from DMM Web Service API v3 (FloorList).
 */
export async function fetchDmmFloors(
  clientConfig?: DmmClientConfig
): Promise<DmmFloorListResponse> {
  const apiId = process.env.DMM_API_ID;
  const affiliateId = process.env.DMM_AFFILIATE_ID;

  if (!apiId || !affiliateId) {
    console.warn(
      "[DMM Client] DMM_API_ID or DMM_AFFILIATE_ID is not set. Returning sample mock floors."
    );
    return getSampleFloorResponse();
  }

  const queryParams = new URLSearchParams({
    api_id: apiId,
    affiliate_id: affiliateId,
    output: "json",
  });

  const url = `https://api.dmm.com/affiliate/v3/FloorList?${queryParams.toString()}`;
  const mergedConfig = { ...DEFAULT_CONFIG, ...clientConfig };

  const response = await fetchWithRetry(url, mergedConfig);
  const data: DmmFloorListResponse = await response.json();

  if (data.result.status !== 200) {
    throw new Error(`DMM API returned error status: ${data.result.status}`);
  }

  return data;
}

/**
 * Fetch genre list from DMM Web Service API v3 (GenreList).
 */
export async function fetchDmmGenres(
  params: FetchDmmGenresParams,
  clientConfig?: DmmClientConfig
): Promise<DmmGenreListResponse> {
  const apiId = process.env.DMM_API_ID;
  const affiliateId = process.env.DMM_AFFILIATE_ID;

  if (!apiId || !affiliateId) {
    console.warn(
      "[DMM Client] DMM_API_ID or DMM_AFFILIATE_ID is not set. Returning sample mock genres."
    );
    return getSampleGenreResponse();
  }

  const queryParams = new URLSearchParams({
    api_id: apiId,
    affiliate_id: affiliateId,
    floor_id: params.floor_id,
    hits: String(params.hits || 20),
    offset: String(params.offset || 1),
    output: "json",
  });

  const url = `https://api.dmm.com/affiliate/v3/GenreList?${queryParams.toString()}`;
  const mergedConfig = { ...DEFAULT_CONFIG, ...clientConfig };

  const response = await fetchWithRetry(url, mergedConfig);
  const data: DmmGenreListResponse = await response.json();

  if (data.result.status !== 200) {
    throw new Error(`DMM API returned error status: ${data.result.status}`);
  }

  return data;
}

function getSampleFloorResponse(): DmmFloorListResponse {
  return {
    request: {
      parameters: { output: "json" },
    },
    result: {
      status: 200,
      site: [
        {
          name: "DMM.com",
          code: "DMM.com",
          service: [
            {
              id: "digital",
              name: "動画",
              code: "digital",
              floor: [{ id: "videoa", name: "ビデオ", code: "videoa" }],
            },
          ],
        },
      ],
    },
  };
}

function getSampleGenreResponse(): DmmGenreListResponse {
  return {
    request: {
      parameters: { output: "json" },
    },
    result: {
      status: 200,
      result_count: 2,
      total_count: 2,
      first_position: 1,
      genre: [
        { genre_id: 1, name: "アニメ" },
        { genre_id: 2, name: "コミック" },
      ],
    },
  };
}



function getSampleDmmResponse(): DmmItemListResponse {
  const sampleItems: DmmItem[] = [
    {
      content_id: "sample_dmm_001",
      title: "サンプルDMM限定コミック全巻セット",
      URL: "https://www.dmm.com/digital/book/sample_001",
      affiliateURL: "https://al.dmm.com/?lurl=https%3A%2F%2Fwww.dmm.com%2Fdigital%2Fbook%2Fsample_001&af_id=sample-990",
      imageURL: {
        large: "https://pics.dmm.com/digital/book/sample_001/sample_001pl.jpg",
        list: "https://pics.dmm.com/digital/book/sample_001/sample_001pt.jpg",
      },
      prices: {
        price: "1980",
        list_price: "2980",
      },
      review: {
        count: 42,
        average: "4.6",
      },
    },
    {
      content_id: "sample_dmm_002",
      title: "サンプルDMM動画スターターパック",
      URL: "https://www.dmm.com/digital/video/sample_002",
      affiliateURL: "https://al.dmm.com/?lurl=https%3A%2F%2Fwww.dmm.com%2Fdigital%2Fvideo%2Fsample_002&af_id=sample-990",
      imageURL: {
        large: "https://pics.dmm.com/digital/video/sample_002/sample_002pl.jpg",
        list: "https://pics.dmm.com/digital/video/sample_002/sample_002pt.jpg",
      },
      prices: {
        price: "980",
        list_price: "1980",
      },
      review: {
        count: 15,
        average: "4.2",
      },
    },
  ];

  return {
    request: {
      parameters: {
        site: "DMM.com",
        hits: "20",
      },
    },
    result: {
      status: 200,
      result_count: sampleItems.length,
      total_count: sampleItems.length,
      first_position: 1,
      items: sampleItems,
    },
  };
}
