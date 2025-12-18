// src/components/api/ApiCacheUsage.tsx
export default function ApiCacheUsage() {
  // dummy data – plug API later
  const cacheUsedMb = 320;
  const cacheTotalMb = 512;
  const cacheFreeMb = cacheTotalMb - cacheUsedMb;
  const usedPercent = Math.round((cacheUsedMb / cacheTotalMb) * 100);

  const donutBg = `conic-gradient(
    rgb(249 115 22) ${usedPercent}%,
    rgb(226 232 240) ${usedPercent}%
  )`;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Cache Usage
          </h3>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            In-memory cache for hot API responses.
          </p>
        </div>
        <span className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-200">
          {cacheUsedMb} / {cacheTotalMb} MB
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* donut */}
        <div className="relative h-24 w-24 flex-shrink-0">
          <div
            className="h-full w-full rounded-full"
            style={{ backgroundImage: donutBg }}
          />
          <div className="absolute inset-4 rounded-full bg-white dark:bg-slate-900" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              Used
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {usedPercent}%
            </span>
          </div>
        </div>

        {/* legend + details */}
        <div className="flex-1 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-gray-500 dark:text-gray-400">
                Cached memory used
              </span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {cacheUsedMb} MB
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-gray-500 dark:text-gray-400">
                Available cache
              </span>
            </div>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {cacheFreeMb} MB
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Total capacity
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {cacheTotalMb} MB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
