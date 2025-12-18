import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
// import { IconTrendingUp, IconActivity, IconCpuBolt, IconChartBar } from "../icons";

type RangeKey = "7d" | "30d";

type DayPoint = {
  date: Date;
  label: string;
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

function formatDay(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function generateReportData(numDays: number): ReportData {
  const days: DayPoint[] = [];
  const today = new Date();

  for (let i = numDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const positive = 150 + Math.round(Math.random() * 50);
    const negative = 10 + Math.round(Math.random() * 30);
    const queued = 5 + Math.round(Math.random() * 20);
    const failed = 3 + Math.round(Math.random() * 15);
    const open = 5 + Math.round(Math.random() * 25);

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
      acc.apiCalls += d.positive + d.negative + d.queued + d.failed + d.open;
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

function downloadCsv(range: RangeKey, report: ReportData) {
  const header = ["Date", "API Calls", "Positive", "Negative", "Queued", "Failed", "Open"];
  const rows = report.days.map((d) => {
    const apiCalls = d.positive + d.negative + d.queued + d.failed + d.open;
    return [d.label, apiCalls, d.positive, d.negative, d.queued, d.failed, d.open];
  });

  const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
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

  const report = useMemo(() => generateReportData(range === "7d" ? 7 : 30), [range]);

  const categories = report.days.map((d) => d.label);

  const series = [
    {
      name: "API Calls",
      type: "column",
      data: report.days.map((d) => d.positive + d.negative + d.queued + d.failed + d.open),
    },
    {
      name: "Positive",
      type: "line",
      data: report.days.map((d) => d.positive),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    stroke: { width: [0, 3], curve: "smooth" },
    plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
    colors: ["#6366F1", "#22C55E"],
    xaxis: { categories, labels: { style: { colors: "#9ca3af" } } },
    yaxis: [{ labels: { style: { colors: "#9ca3af" } } }],
    legend: { position: "top", labels: { colors: "#fff" } },
    tooltip: { theme: "dark" },
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Complete overview of your API usage & performance.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            className="h-9 rounded-full border border-slate-300 bg-transparent px-3 text-xs text-slate-800 dark:text-white dark:border-slate-600"
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
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Neon Tiles */}
      <div className="grid grid-cols-12 gap-5">
        <KpiCard  title="Total API Calls" value={report.totals.apiCalls} gradient="from-purple-500 to-indigo-600" />
        <KpiCard title="Success Calls" value={report.totals.positive} gradient="from-emerald-500 to-teal-600" />
        <KpiCard title="Failed Calls" value={report.totals.failed} gradient="from-rose-500 to-red-600" />
        <KpiCard title="Queued Calls" value={report.totals.queued} gradient="from-orange-400 to-amber-500" />
      </div>

      {/* Gauges + Velocity */}
      <div className="grid grid-cols-12 gap-6">
        <GaugeCard title="Cache Used" percentage={63} color="#10B981" />
        <GaugeCard title="Cost Used" percentage={72} color="#e11d48" />
        <VelocityCard title="Velocity Factor" percentage={(report.totals.apiCalls % 100) + 1} />
      </div>

      {/* Main Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-medium text-slate-900 dark:text-white">
          API Calls vs Positive Responses ({range === "7d" ? "Last 7 days" : "Last 30 days"})
        </h2>
        <Chart height={350} options={options} series={series} type="line" />
      </div>

      {/* Heatmap & Rank Bars */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-6">
          <FakeHeatmap />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <RankBars />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Neon Components ---------------- */

function KpiCard({ icon, title, value, gradient }: any) {
  return (
    <div className="col-span-12 sm:col-span-6 xl:col-span-3 rounded-2xl p-5 border border-slate-200 bg-white dark:border-slate-700 dark:bg-black/30 shadow-sm hover:shadow-lg transition">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-white bg-gradient-to-br ${gradient}`}>
        {icon}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
      <h3 className="mt-1 text-[20px] font-semibold text-slate-900 dark:text-white">{value.toLocaleString()}</h3>
    </div>
  );
}

function GaugeCard({ title, percentage, color }: any) {
  return (
    <div className="col-span-12 md:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-black/30 shadow-sm transition">
      <h3 className="text-sm text-slate-600 dark:text-slate-300 mb-4">{title}</h3>
      <div className="relative flex items-center justify-center">
        <svg width="120" height="120">
          <circle cx="60" cy="60" r="48" stroke="#1e293b" strokeWidth="8" fill="transparent" />
          <circle
            cx="60"
            cy="60"
            r="48"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${(percentage / 100) * 300} 300`}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute text-lg font-semibold text-slate-800 dark:text-white">{percentage}%</span>
      </div>
    </div>
  );
}

function VelocityCard({ title, percentage }: any) {
  return (
    <div className="col-span-12 md:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-black/30 shadow-sm">
      <h3 className="text-sm text-slate-600 dark:text-slate-300 mb-4">{title}</h3>
      <div className="relative flex items-center justify-center">
        <svg width="160" height="90">
          <path d="M10 80 A70 70 0 0 1 150 80" stroke="#1e293b" strokeWidth="8" fill="transparent" />
          <path d="M10 80 A70 70 0 0 1 150 80" stroke="#6366F1" strokeWidth="8" strokeDasharray={`${(percentage / 100) * 220} 220`} strokeLinecap="round" fill="transparent" />
        </svg>
        <span className="absolute text-lg font-semibold text-slate-800 dark:text-white">{percentage}%</span>
      </div>
    </div>
  );
}

function FakeHeatmap() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-black/30 shadow-sm">
      <h3 className="text-sm text-slate-600 dark:text-slate-300 mb-4">Failures by Time (Heatmap)</h3>
      <div className="grid grid-cols-12 gap-1">
        {Array.from({ length: 84 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded transition"
            style={{ background: `rgba(239, 68, 68, ${Math.random() * 0.7 + 0.2})` }}
          ></div>
        ))}
      </div>
    </div>
  );
}

function RankBars() {
  const items = [
    { label: "Auth API", hits: 820 },
    { label: "People Counts API", hits: 650 },
    { label: "Vehicle API", hits: 590 },
    { label: "Billing API", hits: 465 },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-black/30 shadow-sm">
      <h3 className="text-sm text-slate-600 dark:text-slate-300 mb-4">Top API Endpoints</h3>
      <div className="space-y-4">
        {items.map((x) => (
          <div key={x.label}>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-300 mb-1">
              <span>{x.label}</span>
              <span>{x.hits}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition"
                style={{ width: `${(x.hits / 820) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
