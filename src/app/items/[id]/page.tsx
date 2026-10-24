import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getItemById } from "@/lib/items/service";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    return {
      title: "商品が見つかりません | DMM最安値トラッカー",
      description: "お探しのDMMアフィリエイト商品は見つかりませんでした。",
    };
  }

  const priceText = item.currentPrice ? `¥${item.currentPrice.toLocaleString()}` : "価格不明";
  const discountText = item.discountRate ? ` (${item.discountRate}% OFF)` : "";

  return {
    title: `${item.title} | 最安値・価格推移・セール情報 - DMMトラッカー`,
    description: `${item.title} の最新価格は ${priceText}${discountText}。DMMアフィリエイト公式リンク、価格推移・評価まとめ情報を掲載中！`,
    openGraph: {
      title: `${item.title} - 最安値・セール情報`,
      description: `${item.title} のセール価格: ${priceText}`,
      images: item.imageUrl ? [{ url: item.imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: `最新価格: ${priceText}${discountText}`,
      images: item.imageUrl ? [item.imageUrl] : [],
    },
  };
}

export default async function ItemDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    notFound();
  }

  const discount = item.discountRate || 0;
  const currentPrice = item.currentPrice
    ? `¥${item.currentPrice.toLocaleString()}`
    : "価格不明";
  const listPrice = item.listPrice ? `¥${item.listPrice.toLocaleString()}` : null;
  const savings =
    item.listPrice && item.currentPrice
      ? item.listPrice - item.currentPrice
      : 0;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="rounded-lg bg-rose-600 p-1.5 text-lg font-black text-white">
              DMM
            </span>
            <span className="text-xl font-bold tracking-tight">
              セール＆最安値トラッカー
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-rose-600 hover:underline dark:text-rose-400"
          >
            ← 商品一覧へ戻る
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="hover:underline">
            トップ
          </Link>
          <span>/</span>
          <Link href="/" className="hover:underline">
            商品一覧
          </Link>
          <span>/</span>
          <span className="truncate text-zinc-800 dark:text-zinc-200">
            {item.title}
          </span>
        </nav>
        {/* Product Detail Layout */}
        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-12 dark:border-zinc-800 dark:bg-zinc-900">
          {/* Left Column: Image */}
          <div className="md:col-span-5">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
                  No Image
                </div>
              )}

              {/* Badges */}
              {discount > 0 && (
                <div className="absolute top-3 left-3 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                  {discount}% OFF
                </div>
              )}
              <div className="absolute top-3 right-3 rounded-lg bg-black/70 px-2.5 py-1 text-xs font-medium uppercase text-white backdrop-blur-md">
                {item.provider}
              </div>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="flex flex-col justify-between md:col-span-7">
            <div>
              <h1 className="text-xl font-bold leading-snug sm:text-2xl">
                {item.title}
              </h1>

              {/* Rating */}
              {item.rating !== null && item.rating > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-amber-500">
                  <span className="font-bold">★ {item.rating.toFixed(1)}</span>
                  {item.reviewCount !== null && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      ({item.reviewCount}件のレビュー)
                    </span>
                  )}
                </div>
              )}

              {/* Price Highlight Card */}
              <div className="mt-6 rounded-xl border border-rose-100 bg-rose-50/50 p-5 dark:border-rose-900/30 dark:bg-rose-950/20">
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  現在価格 (セール適用中)
                </div>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
                    {currentPrice}
                  </span>
                  {listPrice && discount > 0 && (
                    <span className="text-sm text-zinc-400 line-through">
                      通常定価: {listPrice}
                    </span>
                  )}
                </div>

                {savings > 0 && (
                  <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    通常価格より ¥{savings.toLocaleString()} お得！
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button & Affiliate Info */}
            <div className="mt-8">
              <a
                href={item.affiliateUrl}
                target="_blank"
                rel="nofollow sponsored"
                className="flex w-full items-center justify-center rounded-xl bg-rose-600 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-rose-700 hover:shadow-xl dark:bg-rose-500 dark:hover:bg-rose-600"
              >
                DMM公式で最新価格を見る ↗
              </a>
              <p className="mt-2 text-center text-[11px] text-zinc-400">
                ※ 価格・在庫情報はリアルタイムに変動する場合があります。最新情報はDMM公式サイトをご確認ください。
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Specs Section */}
        <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            商品メタデータ
          </h2>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <dt className="text-zinc-500 dark:text-zinc-400">商品 ID</dt>
              <dd className="mt-1 font-mono font-semibold">{item.id}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <dt className="text-zinc-500 dark:text-zinc-400">提供サービス</dt>
              <dd className="mt-1 font-semibold uppercase">{item.provider}</dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <dt className="text-zinc-500 dark:text-zinc-400">最終更新日時</dt>
              <dd className="mt-1 font-mono">
                {new Date(item.updatedAt).toLocaleString("ja-JP")}
              </dd>
            </div>
            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
              <dt className="text-zinc-500 dark:text-zinc-400">アフィリエイトリンク状態</dt>
              <dd className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400">
                有効 (rel=&quot;nofollow sponsored&quot;)
              </dd>
            </div>
          </dl>
        </div>
      </main>
    </div>
  );
}
