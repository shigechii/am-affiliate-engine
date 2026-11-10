import Link from "next/link";
import type { PropsWithChildren } from "react";

export function Header() {
  return (
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
  );
}
