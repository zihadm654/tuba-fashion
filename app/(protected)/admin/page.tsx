import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PaymentStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import TransactionsList from "@/components/dashboard/transactions-list";

export const metadata = constructMetadata({
  title: "Admin – Tuba Fashion",
  description: "Admin page for only admin management.",
});

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/login");
  const successfulPayments = await prisma.payment.findMany({
    where: {
      status: PaymentStatus.SUCCESS,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const failedPayments = await prisma.payment.findMany({
    where: {
      status: PaymentStatus.FAILED,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const customers = await prisma.user.findMany({
    where: {
      role: "USER",
    },
  });
  const totalCustomers = customers.length;
  return (
    <>
      <DashboardHeader
        heading="Admin Panel"
        text="Access only for users with ADMIN role."
      />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* <InfoCard title="Sales" amount={totalCustomers} growth={growth} /> */}
          {/* <InfoCard />
          <InfoCard />
          <InfoCard /> */}
        </div>
        <TransactionsList
          transactions={successfulPayments}
          title="Successful"
        />
        <TransactionsList transactions={failedPayments} title="Failed" />
      </div>
    </>
  );
}
