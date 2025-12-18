// src/components/api/ApiVelocityBar.tsx
export default function ApiVelocityBar() {
  // dummy values – later replace with real data from API
  const currentRps = 320;
  const limitRps = 500;
  const usagePercent = Math.min(100, Math.round((currentRps / limitRps) * 100));

  const isOver80 = usagePercent >= 80;
  const barClass = isOver80
    ? "bg-error-500"
    : "bg-emerald-500";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          API Velocity
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {currentRps} / {limitRps} req/s
        </span>
      </div>

      <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
        <div
          className={`h-full rounded-full transition-all ${barClass}`}
          style={{ width: `${usagePercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Usage: {usagePercent}%</span>
        <span className={isOver80 ? "text-error-500" : "text-emerald-500"}>
          {isOver80 ? "Close to limit" : "Within safe range"}
        </span>
      </div>
    </div>
  );
}
