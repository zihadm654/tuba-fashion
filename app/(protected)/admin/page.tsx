import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  failedPayments,
  getAnalytics,
  successfulPayments,
} from "@/actions/payment";
import { auth } from "@/auth";
import { TrendingUp, Users } from "lucide-react";

import { constructMetadata } from "@/lib/utils";
import { AreaChartStacked } from "@/components/charts/area-chart-stacked";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import TransactionsList from "@/components/dashboard/transactions-list";
import { SkeletonSection } from "@/components/shared/section-skeleton";

export const metadata = constructMetadata({
  title: "Admin – Tuba Fashion",
  description: "Admin page for only admin management.",
});

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");
  const paymentSuccess = await successfulPayments();
  const paymentFailed = await failedPayments();
  const analytics = await getAnalytics();
  const analyticsData = analytics?.data;

  const totalCustomers = analyticsData?.currentCustomers.length || 0;
  const previousTotal = analyticsData?.previousCustomers.length || 0;

  const growth =
    previousTotal > 0
      ? ((totalCustomers - previousTotal) / previousTotal) * 100
      : 0;

  const currentSales =
    analyticsData?.currentMonthPayments.reduce(
      (total, payment) => total + (payment.payable || 0),
      0,
    ) || 0;
  const previousSales =
    analyticsData?.previousMonthPayments.reduce(
      (total, payment) => total + (payment.payable || 0),
      0,
    ) || 0;
  const salesGrowth =
    previousSales > 0
      ? ((currentSales - previousSales) / previousSales) * 100
      : 0;
  return (
    <>
      <DashboardHeader
        heading="Admin Panel"
        text="Access only for users with ADMIN role."
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            title="Customers"
            amount={totalCustomers || 0}
            growth={growth}
            Icon={Users}
          />
          <InfoCard
            title="Sales"
            amount={currentSales || 0}
            growth={salesGrowth}
            Icon={TrendingUp}
          />
        </div>
        <AreaChartStacked
          currentMonthData={analyticsData?.currentMonthPayments || []}
          previousMonthData={analyticsData?.previousMonthPayments || []}
        />
        <Suspense fallback={<SkeletonSection />}>
          <TransactionsList
            transactions={paymentSuccess?.data || []}
            title="Successful"
          />
        </Suspense>
        <Suspense fallback={<SkeletonSection />}>
          <TransactionsList
            transactions={paymentFailed?.data || []}
            title="Failed"
          />
        </Suspense>
      </div>
    </>
  );
}
