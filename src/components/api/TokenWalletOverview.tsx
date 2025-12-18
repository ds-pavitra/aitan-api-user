import {
  GroupIcon,
  BoxIconLine,
  ArrowUpIcon,
  ArrowDownIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";

export default function TokenWalletOverview() {
  // Dummy data
  const walletBalance = 125000;
  const tokensUsed = 74250;
  const tokensPending = 18500;

  const usedPercent = Math.round((tokensUsed / walletBalance) * 100); // 59%

  // Load animation state
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(usedPercent), 200);
    return () => clearTimeout(t);
  }, [usedPercent]);

  return (
    <div
      className="
        rounded-2xl border border-gray-200 bg-white p-6
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
        dark:border-gray-800 dark:bg-white/[0.03]
      "
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <GroupIcon className="size-6 text-gray-800 dark:text-white/90" />
        </div>

        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Wallet Balance
          </p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {walletBalance.toLocaleString()} Tokens
          </h3>
        </div>

        <div className="ml-auto">
          <Badge color="success">
            <ArrowUpIcon />
            +5.2%
          </Badge>
        </div>
      </div>

      {/* Straight Line Graph */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Token Usage
          </span>
          <span className="font-medium text-gray-800 dark:text-white">
            {progress}%
          </span>
        </div>

        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
          <div
            className="
              h-full rounded-full
              bg-brand-500
              transition-all duration-1000 ease-out
              group-hover:brightness-110
            "
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Tokens Used */}
        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100 dark:bg-gray-800/40 dark:hover:bg-gray-800/60">
          <div className="flex items-center gap-3">
            <BoxIconLine className="size-5 text-gray-700 dark:text-white/80" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tokens Used
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {tokensUsed.toLocaleString()}
              </p>
            </div>
          </div>

          <Badge color="success">
            <ArrowUpIcon />
            +12.4%
          </Badge>
        </div>

        {/* Tokens Pending */}
        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 transition hover:bg-gray-100 dark:bg-gray-800/40 dark:hover:bg-gray-800/60">
          <div className="flex items-center gap-3">
            <GroupIcon className="size-5 text-gray-700 dark:text-white/80" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tokens Pending
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {tokensPending.toLocaleString()}
              </p>
            </div>
          </div>

          <Badge color="warning">
            <ArrowDownIcon />
            -3.1%
          </Badge>
        </div>
      </div>
    </div>
  );
}
