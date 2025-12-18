import PageMeta from "../../components/common/PageMeta";
import ApiStatusMetrics from "../../components/api/ApiStatusMetrics";
import ApiLast7DaysChart from "../../components/api/ApiLast7DaysChart";
import ApiMonthlyTarget from "../../components/api/ApiMonthlyTarget";
// import ApiVelocityBar from "../../components/api/ApiVelocityBar";
import ApiCostSummary from "../../components/api/ApiCostSummary";
import ApiCacheUsage from "../../components/api/ApiCacheUsage";
import TokenWalletOverview from "../../components/api/TokenWalletOverview";

export default function Home() {
  return (
    <>
      <PageMeta
        title="API Monitoring Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="API calls overview: counts, success/failure breakdown, last 7 days activity, velocity, cost and cache usage."
      />

      <div className="grid grid-cols-12 gap-4 md:gap-6">

        <div className="col-span-12 space-y-6 xl:col-span-12 d-flex">
          <TokenWalletOverview />
        </div>

        {/* Left: status + last 7 days + velocity */}
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <ApiStatusMetrics />
          <ApiLast7DaysChart />
        </div>

        {/* Right: monthly target */}
        <div className="col-span-12 xl:col-span-5">
          <ApiMonthlyTarget />
        </div>

        {/* <div className="col-span-12 xl:col-span-12">
          <ApiVelocityBar />
        </div> */}

        {/* Bottom row: cost & cache cards */}
        <div className="col-span-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          <ApiCostSummary />
          <ApiCacheUsage />
        </div>
      </div>
    </>
  );
}
