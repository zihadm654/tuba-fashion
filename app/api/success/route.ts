import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function POST(req: Request, res: Response) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const transactionId = searchParams.get("id");

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 },
      );
    }
    await prisma.paymentLog.update({
      where: { transactionId },
      data: { status: "SUCCESS" },
    });

    return NextResponse.redirect(new URL("/dashboard/success", req.url), 303);
  } catch (error) {
    console.error("Error updating payment log and product quantities:", error);
    return NextResponse.json(
      { error: "Failed to update payment status and product quantities" },
      { status: 500 },
    );
  }
}
