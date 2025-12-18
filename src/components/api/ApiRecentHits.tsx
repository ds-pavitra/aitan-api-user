import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

type ApiStatus = "Success" | "Pending" | "Failed";

interface ApiHit {
  id: number;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: ApiStatus;
  responseTimeMs: number;
  timestamp: string;
}

// dummy last 10 hits
const apiHits: ApiHit[] = [
  {
    id: 1,
    endpoint: "/v1/users",
    method: "GET",
    status: "Success",
    responseTimeMs: 120,
    timestamp: "2025-03-19 12:01:24",
  },
  {
    id: 2,
    endpoint: "/v1/auth/login",
    method: "POST",
    status: "Failed",
    responseTimeMs: 430,
    timestamp: "2025-03-19 11:58:03",
  },
  {
    id: 3,
    endpoint: "/v1/payments/charge",
    method: "POST",
    status: "Success",
    responseTimeMs: 210,
    timestamp: "2025-03-19 11:55:10",
  },
  {
    id: 4,
    endpoint: "/v1/orders",
    method: "GET",
    status: "Success",
    responseTimeMs: 98,
    timestamp: "2025-03-19 11:52:47",
  },
  {
    id: 5,
    endpoint: "/v1/orders/123",
    method: "GET",
    status: "Pending",
    responseTimeMs: 0,
    timestamp: "2025-03-19 11:49:33",
  },
  {
    id: 6,
    endpoint: "/v1/webhooks/notify",
    method: "POST",
    status: "Success",
    responseTimeMs: 320,
    timestamp: "2025-03-19 11:47:02",
  },
  {
    id: 7,
    endpoint: "/v1/users/42",
    method: "PUT",
    status: "Success",
    responseTimeMs: 180,
    timestamp: "2025-03-19 11:44:18",
  },
  {
    id: 8,
    endpoint: "/v1/auth/refresh",
    method: "POST",
    status: "Failed",
    responseTimeMs: 510,
    timestamp: "2025-03-19 11:41:55",
  },
  {
    id: 9,
    endpoint: "/v1/reports/daily",
    method: "GET",
    status: "Success",
    responseTimeMs: 260,
    timestamp: "2025-03-19 11:38:06",
  },
  {
    id: 10,
    endpoint: "/v1/health",
    method: "GET",
    status: "Success",
    responseTimeMs: 40,
    timestamp: "2025-03-19 11:35:44",
  },
];

export default function ApiRecentHits() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent API Hits
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Latest 10 requests handled by your API gateway
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Endpoint
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Method
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Response Time
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Timestamp
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {apiHits.map((hit) => (
              <TableRow key={hit.id}>
                <TableCell className="py-3 text-gray-800 text-theme-sm dark:text-white/90">
                  <code className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-100">
                    {hit.endpoint}
                  </code>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {hit.method}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      hit.status === "Success"
                        ? "success"
                        : hit.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {hit.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {hit.responseTimeMs
                    ? `${hit.responseTimeMs} ms`
                    : "—"}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-xs dark:text-gray-400">
                  {hit.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
