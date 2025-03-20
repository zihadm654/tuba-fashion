import { NextResponse } from "next/server";
import { PaymentStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

// This route handles Instant Payment Notifications from SSL Commerz
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const refId = url.searchParams.get("id");
    const formData = await req.formData();

    // Extract payment data from the IPN notification
    const status = formData.get("status") as string;
    const tranId = formData.get("tran_id") as string;
    const valId = formData.get("val_id") as string;
    const amount = formData.get("amount") as string;
    const cardType = formData.get("card_type") as string;
    const cardNo = formData.get("card_no") as string;
    const cardIssuer = formData.get("card_issuer") as string;
    const cardBrand = formData.get("card_brand") as string;
    const cardIssuerCountry = formData.get("card_issuer_country") as string;
    const currencyAmount = formData.get("currency_amount") as string;
    const valueA = formData.get("value_a") as string;
    const valueB = formData.get("value_b") as string;
    const valueC = formData.get("value_c") as string;
    const valueD = formData.get("value_d") as string;

    if (!refId || !tranId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 },
      );
    }

    // Get the payment record
    const payment = await prisma.payment.findUnique({
      where: { refId },
      include: {
        order: true,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment record not found" },
        { status: 404 },
      );
    }

    // Update payment status based on the IPN notification
    let paymentStatus: PaymentStatus;
    let isSuccessful = false;

    if (status === "VALID" || status === "VALIDATED") {
      paymentStatus = PaymentStatus.SUCCESS;
      isSuccessful = true;
    } else if (status === "FAILED") {
      paymentStatus = PaymentStatus.FAILED;
    } else if (status === "CANCELLED") {
      paymentStatus = PaymentStatus.CANCELED;
    } else {
      paymentStatus = PaymentStatus.PENDING;
    }

    // Update payment record with additional details from IPN
    await prisma.payment.update({
      where: { refId },
      data: {
        status: paymentStatus,
        isSuccessful,
        cardPan: cardNo,
        cardHash: valId, // Using valId as a hash reference
        fee: parseFloat(amount) || payment.payable, // Fallback to original amount if parsing fails
      },
    });

    // If payment is successful, update order status
    if (isSuccessful && payment.order) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          isPaid: true,
          status: "Processing", // Keep as processing since it's now paid but not yet shipped
        },
      });

      // Update product stock for each item in the order
      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: payment.orderId },
        include: { product: true },
      });

      for (const item of orderItems) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.count,
            },
          },
        });
      }

      // Create a notification for admins
      const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
      });

      for (const admin of admins) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            content: `Payment successful for order #${payment.order.number}. Amount: ${payment.payable}`,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("IPN handler error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
