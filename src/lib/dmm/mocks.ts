import {
  DmmItemListResponse,
  DmmFloorListResponse,
  DmmGenreListResponse,
  DmmItem,
} from "@/types/dmm";

export function getSampleDmmResponse(): DmmItemListResponse {
  const sampleItems: DmmItem[] = [
    {
      content_id: "sample_dmm_001",
      title: "サンプルDMM限定コミック全巻セット",
      URL: "https://www.dmm.com/digital/book/sample_001",
      affiliateURL:
        "https://al.dmm.com/?lurl=https%3A%2F%2Fwww.dmm.com%2Fdigital%2Fbook%2Fsample_001&af_id=sample-990",
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
      affiliateURL:
        "https://al.dmm.com/?lurl=https%3A%2F%2Fwww.dmm.com%2Fdigital%2Fvideo%2Fsample_002&af_id=sample-990",
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

export function getSampleFloorResponse(): DmmFloorListResponse {
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

export function getSampleGenreResponse(): DmmGenreListResponse {
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
