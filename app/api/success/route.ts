import { NextResponse } from "next/server";
import { PaymentStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function POST(req: Request, res: Response) {
  try {
    // First try to get transaction ID from form data (SSL Commerz sends as tran_id)
    let refId;
    try {
      const formData = await req.formData();
      refId = formData.get("tran_id") as string;
    } catch (e) {
      // If formData parsing fails, try URL parameters
      console.log("Form data parsing failed, trying URL parameters");
    }

    // If not found in form data, check URL parameters
    if (!refId) {
      const searchParams = new URL(req.url).searchParams;
      refId =
        searchParams.get("refId") ||
        searchParams.get("id") ||
        searchParams.get("tran_id");
    }

    if (!refId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 },
      );
    }

    // Get the payment log first with order relation
    const paymentLog = await prisma.payment.findUnique({
      where: { refId },
      include: {
        order: {
          include: {
            orderItems: true,
          },
        },
      },
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

      // Update each product's stock quantity
      if (paymentLog.order && paymentLog.order.orderItems) {
        for (const item of paymentLog.order.orderItems) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (!product) {
            throw new Error(`Product ${item.productId} not found`);
          }

          if (product.stock < item.count) {
            throw new Error(`Insufficient stock for product ${item.productId}`);
          }

          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.count,
              },
            },
          });
        }
      }
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
