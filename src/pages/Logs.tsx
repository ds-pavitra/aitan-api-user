import { useState } from "react";

type LogEntry = {
  time: string;
  endpoint: string;
  status: number;
  detail: string;
};

const MOCK_LOGS: LogEntry[] = [
  {
    time: "12:01",
    endpoint: "POST /v1/charge",
    status: 200,
    detail: "OK (320 ms)",
  },
  {
    time: "11:58",
    endpoint: "GET /v1/users",
    status: 200,
    detail: "OK (108 ms)",
  },
  {
    time: "11:54",
    endpoint: "POST /v1/charge",
    status: 500,
    detail: "Internal error (retry queued)",
  },
  {
    time: "11:49",
    endpoint: "GET /v1/health",
    status: 200,
    detail: "OK (23 ms)",
  },
];

export default function Logs() {
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const statusPill = (status: number) => {
    // const isOk = status >= 200 && status < 300;
    const isWarning = status >= 300 && status < 400;
    const isError = status >= 400;

    if (isError) {
      return (
        <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] text-rose-500">
          {status}
        </span>
      );
    }

    if (isWarning) {
      return (
        <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-500">
          {status}
        </span>
      );
    }

    // success
    return (
      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-500">
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Logs
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Recent API calls and system events.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <th className="py-2">Time</th>
              <th className="py-2">Endpoint</th>
              <th className="py-2">Status Code</th>
              <th className="py-2">Response Message</th>
              <th className="py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_LOGS.map((log, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-200 last:border-0 dark:border-slate-700"
              >
                <td className="py-2 text-slate-800 dark:text-slate-100">
                  {log.time}
                </td>
                <td className="py-2 text-slate-800 dark:text-slate-100">
                  {log.endpoint}
                </td>
                <td className="py-2">{statusPill(log.status)}</td>
                <td className="py-2 text-slate-800 dark:text-slate-100">
                  {log.detail}
                </td>
                <td className="py-2 text-right">
                  {/* View only for non-200 status codes */}
                  {log.status !== 200 && (
                    <button
                      type="button"
                      onClick={() => setSelectedLog(log)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {/* Eye icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M10 4C6.5 4 3.6 6.1 2.25 9.25C2.18 9.42 2.18 9.58 2.25 9.75C3.6 12.9 6.5 15 10 15C13.5 15 16.4 12.9 17.75 9.75C17.82 9.58 17.82 9.42 17.75 9.25C16.4 6.1 13.5 4 10 4Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 12C11.1046 12 12 11.1046 12 10C12 8.89543 11.1046 8 10 8C8.89543 8 8 8.89543 8 10C8 11.1046 8.89543 12 10 12Z"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>View</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for log details (only opened for non-200 because of above) */}
      {selectedLog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 px-4" style={{zIndex:"99999"}}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                Log details
              </h2>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Time
                </span>
                <span className="font-medium text-slate-900 dark:text-slate-50">
                  {selectedLog.time}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Endpoint
                </span>
                <span className="max-w-[220px] text-right font-medium text-slate-900 dark:text-slate-50">
                  {selectedLog.endpoint}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500 dark:text-slate-400">
                  Status Code
                </span>
                <span className="flex items-center gap-2">
                  {statusPill(selectedLog.status)}
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {selectedLog.status >= 200 && selectedLog.status < 300
                      ? "Success"
                      : selectedLog.status >= 400
                      ? "Error"
                      : "Info"}
                  </span>
                </span>
              </div>

              {/* Response message section (always) */}
              <div className="pt-2">
                <span className="block text-slate-500 dark:text-slate-400">
                  Response Message
                </span>
                <div className="mt-1 rounded-xl bg-slate-50 px-3 py-2 text-[11px] text-slate-800 dark:bg-slate-800 dark:text-slate-100">
                  {selectedLog.detail}
                </div>
              </div>

              {/* Extra description header only for failures (non-2xx) */}
              {selectedLog.status >= 400 && (
                <div className="pt-2">
                  <span className="block text-slate-500 dark:text-slate-400">
                    Log Description
                  </span>
                  <div className="mt-1 rounded-xl bg-rose-50 px-3 py-2 text-[11px] text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
                    The request to{" "}
                    <span className="font-semibold">
                      {selectedLog.endpoint}
                    </span>{" "}
                    at <span className="font-semibold">{selectedLog.time}</span>{" "}
                    failed with status code{" "}
                    <span className="font-semibold">
                      {selectedLog.status}
                    </span>
                    . Response: {selectedLog.detail}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="inline-flex items-center rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
