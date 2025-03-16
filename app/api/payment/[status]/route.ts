import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { status: string } },
) {
  try {
    const data = await request.formData();
    const refId = data.get("tran_id") as string;

    if (!refId) {
      return NextResponse.json(
        { error: "Transaction ID not found" },
        { status: 400 },
      );
    }

    const status = params.status.toUpperCase();

    // Update transaction status
    await prisma.payment.update({
      where: { refId: refId },
      data: {
        status: status as any,
        // paymentMethod: data.get("card_type") as string,
      },
    });

    // Redirect based on status
    const redirectUrl = `/payment/${status.toLowerCase()}?id=${refId}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
