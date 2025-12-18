// src/components/api/ApiCostSummary.tsx
export default function ApiCostSummary() {
  // dummy data – plug API later
  const costPerThousand = 0.25; // $ / 1k calls
  const balanceTotal = 100;     // $
  const balanceUsed = 37.5;     // $
  const balanceRemaining = balanceTotal - balanceUsed;
  const usedPercent = Math.round((balanceUsed / balanceTotal) * 100);

  const gaugeBg = `conic-gradient(
    rgb(79 70 229) ${usedPercent}%,
    rgb(229 231 235) ${usedPercent}%
  )`;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Cost & Balance
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Billing usage for this billing period.
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-medium text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
          ${costPerThousand.toFixed(2)} / 1k calls
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* radial gauge */}
        <div className="relative h-24 w-24 flex-shrink-0">
          <div
            className="h-full w-full rounded-full"
            style={{ backgroundImage: gaugeBg }}
          />
          <div className="absolute inset-2 rounded-full bg-white dark:bg-slate-900" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Used
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {usedPercent}%
            </span>
          </div>
        </div>

        {/* numbers */}
        <div className="flex-1 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Balance used
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ${balanceUsed.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Balance remaining
            </span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              ${balanceRemaining.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Total balance
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              ${balanceTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
