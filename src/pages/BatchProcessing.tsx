import { useState } from "react";
import Badge from "../components/ui/badge/Badge";

type RowData = {
  [key: string]: string;
  __status: "pending" | "completed";
};

export default function BatchProcessing() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<RowData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  /* ---------------- Sample CSV Download ---------------- */
  const downloadSampleCSV = () => {
    const sample = `user_id,email,amount
101,test1@example.com,500
102,test2@example.com,750`;

    const blob = new Blob([sample], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_batch_format.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  /* ---------------- CSV Upload + Submit ---------------- */
  const handleFileSubmit = () => {
    if (!file || isBatchRunning) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split("\n").filter(Boolean);
      const headerRow = lines[0].split(",").map(h => h.trim());

      // Set headers only once
      if (headers.length === 0) {
        setHeaders(headerRow);
      }

      const newRows: RowData[] = lines.slice(1).map((line) => {
        const values = line.split(",");
        const obj: RowData = { __status: "pending" };

        headerRow.forEach((h, i) => {
          obj[h] = values[i]?.trim() || "";
        });

        return obj;
      });

      // Append rows
      setRows((prev) => [...prev, ...newRows]);
      setFile(null);
    };

    reader.readAsText(file);
  };

  /* ---------------- Batch Processing ---------------- */
  const startBatchProcessing = () => {
    if (!rows.length || isBatchRunning) return;

    setIsBatchRunning(true);

    // Simulated batch window
    setTimeout(() => {
      setRows((prev) =>
        prev.map((row) => ({ ...row, __status: "completed" }))
      );
      setIsBatchRunning(false);
    }, 4000);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Batch Processing
        </h2>

        <button
          onClick={downloadSampleCSV}
          className="text-sm font-medium text-brand-600 hover:underline"
        >
          Download Sample CSV
        </button>
      </div>

      {/* Upload Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="file"
          accept=".csv"
          disabled={isBatchRunning}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block text-sm disabled:opacity-50"
        />

        <button
          onClick={handleFileSubmit}
          disabled={!file || isBatchRunning}
          className="
            rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white
            hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          Submit
        </button>
      </div>

      {/* Batch Info Message */}
      {isBatchRunning && (
        <div className="mb-4 rounded-lg bg-warning-50 p-3 text-sm text-warning-700 dark:bg-warning-900/20 dark:text-warning-300">
          ⏳ The batch processing time is <strong>12:00 AM to 6:00 AM</strong>.
          Uploading is disabled during this period.
        </div>
      )}

      {/* Start Batch Button */}
      {rows.length > 0 && (
        <div className="mb-4">
          <button
            onClick={startBatchProcessing}
            disabled={isBatchRunning}
            className="
              rounded-lg bg-gray-800 px-5 py-2 text-sm font-medium text-white
              hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            Start Batch Processing
          </button>
        </div>
      )}

      {/* Table */}
      {rows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400"
                  >
                    {h}
                  </th>
                ))}
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  {headers.map((h) => (
                    <td
                      key={h}
                      className="px-3 py-2 text-gray-700 dark:text-gray-300"
                    >
                      {row[h]}
                    </td>
                  ))}

                  <td className="px-3 py-2">
                    {row.__status === "pending" ? (
                      <Badge color="warning">Pending</Badge>
                    ) : (
                      <Badge color="success">Completed</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
