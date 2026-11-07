export function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200 bg-white py-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
      <p>© {new Date().getFullYear()} DMM セール＆最安値トラッカー. All rights reserved.</p>
      <p className="mt-1">
        本サイトはDMMアフィリエイトプログラムに参加しており、掲載リンク経由での購入に対して紹介料を得る場合があります。
      </p>
    </footer>
  );
}
