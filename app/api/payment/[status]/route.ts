import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: { status: string } }
) {
  try {
    const data = await request.formData();
    const tran_id = data.get("tran_id") as string;

    if (!tran_id) {
      return NextResponse.json(
        { error: "Transaction ID not found" },
        { status: 400 }
      );
    }

    const status = params.status.toUpperCase();
    
    // Update transaction status
    await prisma.transaction.update({
      where: { transactionId: tran_id },
      data: { 
        status: status as "SUCCESS" | "FAILED" | "CANCELLED",
        paymentMethod: data.get("card_type") as string,
      },
    });

    // Redirect based on status
    const redirectUrl = `/payment/${status.toLowerCase()}?id=${tran_id}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}