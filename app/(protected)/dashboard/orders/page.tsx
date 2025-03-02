import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PaymentStatus } from "@prisma/client";
import PaymentLogs from "@/components/dashboard/payment/payment-logs";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const successfulPayments = await prisma.paymentLog.findMany({
    where: {
      userId: session.user.id,
      status: PaymentStatus.SUCCESS,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container relative">
      <div className="mx-auto flex max-w-[980px] flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
            My Orders
          </h1>
          <p className="text-muted-foreground">
            View all your successful orders and their details.
          </p>
        </div>
        <PaymentLogs payments={successfulPayments} />
      </div>
    </div>
  );
}