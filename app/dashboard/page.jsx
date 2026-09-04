import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LowStockAlertCard from "@/components/dashboard/LowStockAlertCard";
import RecentSalesTable from "@/components/dashboard/RecentSalesTable";
import RevenueChart from "@/components/dashboard/RevenueChart";
import StatsOverview from "@/components/dashboard/StatsOverview";

export default function DashboardPage() {
  return (
    <main className="min-h-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex w-full flex-col gap-6">
        <DashboardHeader />
        <StatsOverview />
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RevenueChart />
          </div>
          <LowStockAlertCard />
        </section>
        <RecentSalesTable />
      </div>
    </main>
  );
}
