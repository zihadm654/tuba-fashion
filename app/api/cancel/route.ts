import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const transactionId = url.searchParams.get("id");

    if (!transactionId) {
      return NextResponse.redirect(new URL("/dashboard/cancel", req.url), 303);
    }

    // Find and update the payment log status to CANCELED
    await prisma.paymentLog.update({
      where: { transactionId },
      data: { status: "CANCELED" },
    });

    return NextResponse.redirect(new URL("/dashboard/cancel", req.url), 303);
  } catch (error) {
    console.error("Payment cancel handler error:", error);
    return NextResponse.redirect(new URL("/dashboard/cancel", req.url), 303);
  }
}
