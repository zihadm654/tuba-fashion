import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const orderId = formData.get("orderId") as string;
    const status = formData.get("status") as string;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "Order ID and status are required" },
        { status: 400 },
      );
    }

    // Validate status
    const validStatuses = [
      "Processing",
      "Shipped",
      "Delivered",
      "ReturnProcessing",
      "ReturnCompleted",
      "Cancelled",
      "RefundProcessing",
      "RefundCompleted",
      "Denied",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
    });

    // Redirect back to the order page
    return NextResponse.redirect(
      new URL(`/admin/orders/${orderId}`, req.url),
      303,
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 },
    );
  }
}
