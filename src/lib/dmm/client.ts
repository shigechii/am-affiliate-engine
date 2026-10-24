import { DmmItemListResponse, DmmItem } from "@/types/dmm";

export interface FetchDmmItemsParams {
  site?: string;
  service?: string;
  floor?: string;
  hits?: number;
  offset?: number;
  sort?: string;
  keyword?: string;
}

/**
 * Fetch items from DMM Web Service API v3.
 * If DMM_API_ID or DMM_AFFILIATE_ID is not configured, returns mock sample data.
 */
export async function fetchDmmItems(
  params: FetchDmmItemsParams = {}
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

  const url = `https://api.dmm.com/affiliate/v3/ItemList?${queryParams.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `DMM API request failed with status: ${response.status} ${response.statusText}`
    );
  }

  const data: DmmItemListResponse = await response.json();
  if (data.result.status !== 200) {
    throw new Error(`DMM API returned error status: ${data.result.status}`);
  }

  return data;
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
