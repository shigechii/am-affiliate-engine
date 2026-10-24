import Link from "next/link";
import { getItems } from "@/lib/items/service";
import { SortOption } from "@/types/item";
import { ItemFilterBar } from "@/components/ItemFilterBar";
import { ItemGrid } from "@/components/ItemGrid";
import { Pagination } from "@/components/Pagination";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";
  const sort = (resolvedParams.sort as SortOption) || "latest";
  const page = parseInt(resolvedParams.page || "1", 10);

  const result = await getItems({
    query,
    sort,
    page,
    limit: 24,
  });

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Header Banner */}
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
          <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="hover:text-rose-600 dark:hover:text-rose-400">
              商品一覧
            </Link>
            <a
              href="https://affiliate.dmm.com/"
              target="_blank"
              rel="nofollow sponsored"
              className="hidden hover:text-rose-600 sm:inline dark:hover:text-rose-400"
            >
              DMM公式 ↗
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Title & Subtitle */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            DMMアフィリエイト商品一覧・価格変動追跡
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            最新のDMMセール情報・大幅割引商品・価格更新をリアルタイムで掲載中 ({result.totalCount.toLocaleString()}件)
          </p>
        </div>

        {/* Filter & Search Bar */}
        <ItemFilterBar />

        {/* Product Grid */}
        <ItemGrid items={result.items} />

        {/* Pagination */}
        <Pagination
          currentPage={result.currentPage}
          totalPages={result.totalPages}
          query={query}
          sort={sort}
        />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-200 bg-white py-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <p>© {new Date().getFullYear()} DMM セール＆最安値トラッカー. All rights reserved.</p>
        <p className="mt-1">
          本サイトはDMMアフィリエイトプログラムに参加しており、掲載リンク経由での購入に対して紹介料を得る場合があります。
        </p>
      </footer>
    </div>
  );
}

