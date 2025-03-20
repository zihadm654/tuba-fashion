import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const refId = url.searchParams.get("id");

    if (!refId) {
      return NextResponse.redirect(new URL("/dashboard/fail", req.url), 303);
    }

    // Find and update the payment log status to FAILED
    await prisma.payment.update({
      where: { refId },
      data: { 
        status: "FAILED",
        isSuccessful: false 
      },
    });
    
    // Also update the order status
    const payment = await prisma.payment.findUnique({
      where: { refId },
      select: { orderId: true }
    });
    
    if (payment?.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: "Cancelled" }
      });
    }

    return NextResponse.redirect(new URL("/dashboard/fail", req.url), 303);
  } catch (error) {
    console.error("Payment cancel handler error:", error);
    return NextResponse.redirect(new URL("/dashboard/fail", req.url), 303);
  }
}
