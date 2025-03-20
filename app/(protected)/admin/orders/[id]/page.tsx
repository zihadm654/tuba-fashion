import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import { format } from "date-fns";
import { ArrowLeft, CreditCard, Package, Truck } from "lucide-react";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardHeader } from "@/components/dashboard/header";

export const metadata = constructMetadata({
  title: "Order Details – Tuba Fashion",
  description: "View order details and manage order status.",
});

function getOrderStatusColor(status: string) {
  switch (status) {
    case "Processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
    case "Shipped":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
    case "Delivered":
      return "bg-green-100 text-green-800 hover:bg-green-100/80";
    case "ReturnProcessing":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100/80";
    case "ReturnCompleted":
      return "bg-teal-100 text-teal-800 hover:bg-teal-100/80";
    case "Cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100/80";
    case "RefundProcessing":
      return "bg-orange-100 text-orange-800 hover:bg-orange-100/80";
    case "RefundCompleted":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80";
    case "Denied":
      return "bg-rose-100 text-rose-800 hover:bg-rose-100/80";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  }
}

function getOrderStatusIcon(status: string) {
  switch (status) {
    case "Shipped":
    case "Delivered":
      return <Truck className="mr-2 h-4 w-4" />;
    case "Processing":
      return <Package className="mr-2 h-4 w-4" />;
    case "RefundProcessing":
    case "RefundCompleted":
      return <CreditCard className="mr-2 h-4 w-4" />;
    default:
      return null;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // Parse shipping address from JSON
  // const shippingAddress = order.shippingAddress as any;

  // Calculate order subtotal from items
  // const subtotal = order.orderItems.reduce(
  //   (sum, item) => sum + (item?.price ?? 0) * (item?.quantity ?? 0),
  //   0,
  // );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <DashboardHeader
          heading={`Order #${order.id.substring(0, 8)}...`}
          text="View and manage order details."
        />
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
      </div>

      {/* Order Status Banner */}
      <Card
        className={`border-l-4 ${getOrderStatusColor(order.status).split(" ")[0].replace("bg-", "border-")}`}
      >
        <CardContent className="flex items-center p-4">
          {getOrderStatusIcon(order.status)}
          <div>
            <p className="font-medium">
              Order Status:{" "}
              <Badge className={getOrderStatusColor(order.status)}>
                {order.status}
              </Badge>
            </p>
            <p className="text-muted-foreground text-sm">
              Last updated:{" "}
              {format(
                new Date(order.updatedAt || order.createdAt),
                "PPP 'at' p",
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Details about this order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Order ID
                  </p>
                  <p className="font-mono">{order.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Date Placed
                  </p>
                  <p>{format(new Date(order.createdAt), "PPP")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Status
                  </p>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Amount
                  </p>
                  <p className="font-bold">৳{order.total.toLocaleString()}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Customer
                </p>
                <p className="font-medium">{order.user?.name || "Guest"}</p>
                <p className="text-muted-foreground text-sm">
                  {order.user?.email || "No email"}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Shipping Address
                </p>
                {/* <p className="font-medium">{shippingAddress.fullName}</p>
                <p>{shippingAddress.address}</p>
                <p>
                  {shippingAddress.city}, {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.country}</p>
                <p className="mt-1 text-sm font-medium">
                  Phone: {shippingAddress.phone}
                </p> */}
              </div>

              <Separator />

              <div className="flex items-start gap-2">
                <CreditCard className="text-muted-foreground mt-0.5 h-5 w-5" />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Payment Information
                  </p>
                  <p>
                    Method: {(order as any).paymentMethod || "Not specified"}
                  </p>
                  <p>Payment ID: {(order as any).paymentId || "N/A"}</p>
                  <p>
                    Status:{" "}
                    <Badge variant="outline">
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>Products in this order</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.orderItems.map((item) => (
                  <TableRow key={item.orderId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.product.images[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-md">
                            <Package className="text-muted-foreground h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{item.product.title}</p>
                          {/* {(item.color || item.size) && (
                            <p className="text-muted-foreground text-xs">
                              {(item as any).color && `Color: ${(item as any).color}`}
                              {item.color && item.size && " | "}
                              {item.size && `Size: ${item.size}`}
                            </p>
                          )} */}
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell>{item.quantity}</TableCell> */}
                    <TableCell>৳{item.price}</TableCell>
                    <TableCell className="text-right">
                      {/* ৳{(item.price * item.quantity).toLocaleString()} */}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {/* ৳{subtotal} */}
                  </TableCell>
                </TableRow>
                {order.shipping > 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-medium">
                      Shipping
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ৳{order.shipping.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-right text-lg font-medium"
                  >
                    Total
                  </TableCell>
                  <TableCell className="text-right text-lg font-bold">
                    ৳{order.total.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Order Status</CardTitle>
          <CardDescription>Change the status of this order</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action="/api/orders/update-status"
            method="POST"
            className="flex items-end gap-4"
          >
            <input type="hidden" name="orderId" value={order.id} />
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={order.status}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="ReturnProcessing">Return Processing</option>
                <option value="ReturnCompleted">Return Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="RefundProcessing">Refund Processing</option>
                <option value="RefundCompleted">Refund Completed</option>
                <option value="Denied">Denied</option>
              </select>
            </div>
            <Button type="submit" className="gap-2">
              <span>Update Status</span>
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-muted-foreground text-sm">
          <p>
            Status changes will be immediately reflected in the customer's order
            history.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
