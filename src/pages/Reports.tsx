import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

type RangeKey = "7d" | "30d";

type DayPoint = {
    date: Date;
    label: string; // formatted for x-axis
    positive: number;
    negative: number;
    queued: number;
    failed: number;
    open: number;
};

type ReportData = {
    days: DayPoint[];
    totals: {
        apiCalls: number;
        positive: number;
        negative: number;
        queued: number;
        failed: number;
        open: number;
    };
};

// Helper: format date as "DD Mon" (e.g. 19 Mar)
function formatDay(d: Date): string {
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
    });
}

// Generate dummy data for N last days (including today)
function generateReportData(numDays: number): ReportData {
    const days: DayPoint[] = [];
    const today = new Date();

    for (let i = numDays - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);

        // dummy values – tweak as you like
        const positive = 150 + Math.round(Math.random() * 50); // 150–200
        const negative = 10 + Math.round(Math.random() * 30);  // 10–40
        const queued = 5 + Math.round(Math.random() * 20);     // 5–25
        const failed = 3 + Math.round(Math.random() * 15);     // 3–18
        const open = 5 + Math.round(Math.random() * 25);       // 5–30

        days.push({
            date: d,
            label: formatDay(d),
            positive,
            negative,
            queued,
            failed,
            open,
        });
    }

    const totals = days.reduce(
        (acc, d) => {
            acc.positive += d.positive;
            acc.negative += d.negative;
            acc.queued += d.queued;
            acc.failed += d.failed;
            acc.open += d.open;
            acc.apiCalls +=
                d.positive + d.negative + d.queued + d.failed + d.open;
            return acc;
        },
        {
            apiCalls: 0,
            positive: 0,
            negative: 0,
            queued: 0,
            failed: 0,
            open: 0,
        }
    );

    return { days, totals };
}

// CSV download for current range
function downloadCsv(range: RangeKey, report: ReportData) {
    const header = [
        "Date",
        "API Calls",
        "Positive",
        "Negative",
        "Queued",
        "Failed",
        "Open",
    ];
    const rows = report.days.map((d) => {
        const apiCalls =
            d.positive + d.negative + d.queued + d.failed + d.open;
        return [
            d.label,
            apiCalls,
            d.positive,
            d.negative,
            d.queued,
            d.failed,
            d.open,
        ];
    });

    const csv =
        [header.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `api-report-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function Reports() {
    const [range, setRange] = useState<RangeKey>("7d");

    const report = useMemo(
        () => generateReportData(range === "7d" ? 7 : 30),
        [range]
    );

    const categories = report.days.map((d) => d.label);

    // 4 colored lines: Positive, Negative, Queued, Failed
    const series = [
        {
            name: "API Calls",
            data: report.days.map(
                (d) => d.positive + d.negative + d.queued + d.failed + d.open
            ),
        },
        {
            name: "Positive",
            data: report.days.map((d) => d.positive),
        },
        {
            name: "Negative",
            data: report.days.map((d) => d.negative),
        },
        {
            name: "Queued",
            data: report.days.map((d) => d.queued),
        },
        {
            name: "Failed",
            data: report.days.map((d) => d.failed),
        },
        // you can add Open as a 5th line if you want:
        {
            name: "Open",
            data: report.days.map((d) => d.open),
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: "area",
            toolbar: { show: false },
            fontFamily: "Outfit, sans-serif",
        },
        colors: [
            "#3B82F6",
            "#22C55E", // Positive - green
            "#EF4444", // Negative - red
            "#F59E0B", // Queued - amber
            "#6366F1", // Failed - indigo
            "#06B6D4", // Open - cyan (if you enable it)
        ],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.35,
                opacityTo: 0,
            },
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "right",
        },
        markers: {
            size: 3,
            hover: { size: 6 },
        },
        xaxis: {
            categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: "#6B7280" },
            },
        },
        yaxis: {
            labels: {
                style: { colors: "#6B7280" },
            },
            title: {
                text: "Count",
                style: { fontSize: "12px", color: "#6B7280" },
            },
        },
        grid: {
            yaxis: { lines: { show: true } },
            xaxis: { lines: { show: false } },
        },
        dataLabels: { enabled: false },
        tooltip: { enabled: true },
    };

    const rangeLabel =
        range === "7d" ? "Last 7 days" : "Last 30 days";

    return (
        <div className="space-y-6">
            {/* header */}
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                        Reports & Analytics
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Multi-line chart of daily API results.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        className="h-9 rounded-full border border-slate-300 bg-transparent px-3 text-xs text-slate-800 dark:text-slate-100 dark:border-slate-600"
                        value={range}
                        onChange={(e) => setRange(e.target.value as RangeKey)}
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                    </select>

                    <button
                        onClick={() => downloadCsv(range, report)}
                        className="inline-flex h-9 items-center justify-center rounded-full bg-indigo-600 px-4 text-xs font-medium text-white hover:bg-indigo-500"
                    >
                        Download (Excel-ready)
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* chart */}
                <div className="col-span-12 lg:col-span-7">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <h2 className="mb-4 text-sm font-medium text-slate-900 dark:text-slate-50">
                            Daily API Performance ({rangeLabel})
                        </h2>
                        <Chart options={options} series={series} type="area" height={330} />
                    </div>
                </div>

                {/* summary table */}
                <div className="col-span-12 lg:col-span-5">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                        <h2 className="mb-4 text-sm font-medium text-slate-900 dark:text-slate-50">
                            Summary
                        </h2>

                        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-100">
                            <Row label="API Calls" value={report.totals.apiCalls} />
                            <Row label="Positive Response" value={report.totals.positive} />
                            <Row label="Negative Response" value={report.totals.negative} />
                            <Row label="Queued" value={report.totals.queued} />
                            <Row label="Failed" value={report.totals.failed} />
                            <Row label="Open (In Process)" value={report.totals.open} last />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// simple row for summary table
function Row({
    label,
    value,
    last,
}: {
    label: string;
    value: number;
    last?: boolean;
}) {
    return (
        <div
            className={
                "flex items-center justify-between " +
                (last
                    ? ""
                    : "border-b border-dashed border-slate-200 pb-1 dark:border-slate-700")
            }
        >
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );
}
