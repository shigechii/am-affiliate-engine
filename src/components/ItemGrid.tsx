import { Item } from "@/types/item";
import { ItemCard } from "./ItemCard";

interface ItemGridProps {
  items: Array<Item>;
}

export function ItemGrid({ items }: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-800">
        <div className="text-4xl mb-3">🔍</div>
        <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
          該当する商品が見つかりませんでした
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          キーワードや検索条件を変更してお試しください。
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
