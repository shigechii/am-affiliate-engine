import { PriceHistoryRecord } from "@/types/item";

interface PriceHistoryChartProps {
  history: Array<PriceHistoryRecord>;
  currentPrice: number | null;
}

export function PriceHistoryChart({
  history,
  currentPrice,
}: PriceHistoryChartProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        価格履歴データが存在しません。
      </div>
    );
  }

  const prices = history.map((h) => h.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  const points = history.map((record, index) => {
    const x =
      history.length === 1
        ? paddingX + chartWidth / 2
        : paddingX + (index / (history.length - 1)) * chartWidth;
    const y =
      paddingY +
      chartHeight -
      ((record.price - minPrice) / priceRange) * chartHeight;

    return { x, y, record };
  });

  const linePath = points.reduce(
    (acc, pt, idx) => `${acc} ${idx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`,
    ""
  );

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];
  const areaPath = `${linePath} L ${lastPoint.x} ${paddingY + chartHeight} L ${firstPoint.x} ${paddingY + chartHeight} Z`;

  const isAllTimeLow = currentPrice !== null && currentPrice <= minPrice;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              📈 最安値・価格推移グラフ
            </h2>
            {isAllTimeLow && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                ★ 過去最安値更新中！
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            過去90日間の価格変動履歴 ({history.length}件の記録)
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="rounded-lg bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 dark:bg-emerald-950/30 dark:border-emerald-800/40">
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
              過去最安値
            </div>
            <div className="font-bold text-emerald-700 dark:text-emerald-300">
              ¥{minPrice.toLocaleString()}
            </div>
          </div>
          <div className="rounded-lg bg-zinc-100 border border-zinc-200 px-3 py-1.5 dark:bg-zinc-800 dark:border-zinc-700">
            <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
              過去最高値
            </div>
            <div className="font-bold text-zinc-700 dark:text-zinc-300">
              ¥{maxPrice.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d48" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#e4e4e7" strokeDasharray="4 4" className="dark:stroke-zinc-800" />
          <line x1={paddingX} y1={paddingY + chartHeight / 2} x2={width - paddingX} y2={paddingY + chartHeight / 2} stroke="#e4e4e7" strokeDasharray="4 4" className="dark:stroke-zinc-800" />
          <line x1={paddingX} y1={paddingY + chartHeight} x2={width - paddingX} y2={paddingY + chartHeight} stroke="#e4e4e7" className="dark:stroke-zinc-800" />

          <path d={areaPath} fill="url(#priceGradient)" />
          <path d={linePath} fill="none" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((pt, idx) => {
            const isMin = pt.record.price === minPrice;
            const formattedDate = new Date(pt.record.recordedAt).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });

            return (
              <g key={pt.record.id || idx} className="group">
                <circle cx={pt.x} cy={pt.y} r={isMin ? "6" : "4"} fill={isMin ? "#10b981" : "#e11d48"} stroke="#ffffff" strokeWidth="2" />
                {isMin && (
                  <g transform={`translate(${pt.x}, ${pt.y - 12})`}>
                    <rect x="-30" y="-18" width="60" height="16" rx="4" fill="#10b981" />
                    <text x="0" y="-6" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">¥{pt.record.price.toLocaleString()}</text>
                  </g>
                )}
                <text x={pt.x} y={height - 8} textAnchor="middle" fill="#a1a1aa" fontSize="10">{formattedDate}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
