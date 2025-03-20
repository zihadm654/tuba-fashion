import Link from "next/link";
import { redirect } from "next/navigation";
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
  title: "Orders – Tuba Fashion",
  description: "Check and manage your latest orders.",
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
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  // Fetch all orders with their items and related products
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
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
        heading="Orders"
        text="Check and manage your latest orders."
      />

      {orders.length === 0 ? (
        <EmptyPlaceholder>
          <EmptyPlaceholder.Icon name="package" />
          <EmptyPlaceholder.Title>No orders listed</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any orders yet. Start ordering a product.
          </EmptyPlaceholder.Description>
          <Button asChild>
            <Link href="/products">Buy Products</Link>
          </Button>
        </EmptyPlaceholder>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
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
                    {order.user?.name || "Guest"}
                    <br />
                    <span className="text-muted-foreground text-xs">
                      {order.user?.email || "No email"}
                    </span>
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
                      <Link href={`/admin/orders/${order.id}`}>View</Link>
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
