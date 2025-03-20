import { NextResponse } from "next/server";
import { PaymentStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function POST(req: Request, res: Response) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const refId = searchParams.get("refId");

    if (!refId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 },
      );
    }

    // Get the payment log first
    const paymentLog = await prisma.payment.findUnique({
      where: { refId },
    });

    if (!paymentLog) {
      return NextResponse.json(
        { error: "Payment log not found" },
        { status: 404 },
      );
    }

    // Parse the items from the payment log
    // const items = paymentLog.items as { productId: string; quantity: number }[];

    // Update each product's quantity in a transaction
    await prisma.$transaction(async (tx) => {
      // Update the payment log status to SUCCESS
      await tx.payment.update({
        where: { refId },
        data: { status: PaymentStatus.SUCCESS },
      });

      // Update each product's quantity
      // for (const item of items) {
      //   const product = await tx.product.findUnique({
      //     where: { id: item.productId },
      //   });

      //   if (!product) {
      //     throw new Error(`Product ${item.productId} not found`);
      //   }

      //   if (product.stock < item.stock) {
      //     throw new Error(
      //       `Insufficient stock for product ${item.productId}`,
      //     );
      // }

      //       await tx.product.update({
      //         where: { id: item.productId },
      //         data: {
      //           stock: {
      //             decrement: item.stock,
      //           },
      //         },
      //       });
      //     }
    });

    //   return NextResponse.redirect(new URL("/dashboard/success", req.url), 303);
  } catch (error) {
    console.error("Error updating payment log and product quantities:", error);
    return NextResponse.json(
      { error: "Failed to update payment status and product quantities" },
      { status: 500 },
    );
  }
}
