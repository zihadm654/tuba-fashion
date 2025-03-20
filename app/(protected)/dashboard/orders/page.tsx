import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PaymentStatus } from "@prisma/client";
import { format } from "date-fns";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "My Orders – Tuba Fashion",
  description: "View your order history and track your purchases.",
});

function getOrderStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
    case "PROCESSING":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
    case "SHIPPED":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
    case "DELIVERED":
      return "bg-green-100 text-green-800 hover:bg-green-100/80";
    case "CANCELLED":
      return "bg-red-100 text-red-800 hover:bg-red-100/80";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  }
}

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const successfulPayments = await prisma.payment.findMany({
    where: {
      userId: session.user.id,
      // status: PaymentStatus.SUCCESS,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Fetch user's orders
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              title: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <>
      <DashboardHeader
        heading="My Orders"
        text="View your order history and track your purchases."
      />

      {orders.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="package" />
          <EmptyPlaceholder.Title>No orders yet</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You haven&apos;t placed any orders yet. Start shopping to see your
            orders here.
          </EmptyPlaceholder.Description>
          <Button asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
        </EmptyPlaceholder>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge className={getOrderStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.orderItems.length} item(s)
                    <br />
                    <span className="text-muted-foreground text-xs">
                      {order.orderItems
                        .map((item) => item.product.title)
                        .join(", ")
                        .substring(0, 20)}
                      {order.orderItems
                        .map((item) => item.product.title)
                        .join(", ").length > 20
                        ? "..."
                        : ""}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">৳{order.total}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/orders/${order.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
