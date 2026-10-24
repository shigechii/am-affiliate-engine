import Image from "next/image";
import Link from "next/link";
import { Item } from "@/types/item";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const discount = item.discountRate || 0;
  const currentPrice = item.currentPrice
    ? `¥${item.currentPrice.toLocaleString()}`
    : "価格不明";
  const listPrice = item.listPrice ? `¥${item.listPrice.toLocaleString()}` : null;

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        {/* Image / Thumbnail Container */}
        <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
              No Image
            </div>
          )}

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 rounded-md bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
              {discount}% OFF
            </div>
          )}

          {/* Provider Badge */}
          <div className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase text-white backdrop-blur-sm">
            {item.provider}
          </div>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-900 group-hover:text-rose-600 dark:text-zinc-100 dark:group-hover:text-rose-400">
          {item.title}
        </h3>

        {/* Rating */}
        {item.rating !== null && item.rating > 0 && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-500">
            <span>★ {item.rating.toFixed(1)}</span>
            {item.reviewCount !== null && (
              <span className="text-zinc-400">({item.reviewCount})</span>
            )}
          </div>
        )}
      </div>

      {/* Price & Actions */}
      <div className="mt-4 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
              {currentPrice}
            </span>
            {listPrice && discount > 0 && (
              <span className="text-xs text-zinc-400 line-through">
                {listPrice}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Link
            href={`/items/${encodeURIComponent(item.id)}`}
            className="flex items-center justify-center rounded-lg border border-zinc-300 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            詳細を見る
          </Link>
          <a
            href={item.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored"
            className="flex items-center justify-center rounded-lg bg-rose-600 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600"
          >
            DMMで見る ↗
          </a>
        </div>
      </div>
    </div>
  );
}
