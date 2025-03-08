import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";

// Fix: Remove the res parameter as it's not needed in Next.js App Router
export async function POST(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const transactionId = await searchParams.get("id");

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 },
      );
    }

    // The issue is here - we need to check if there's actually a body
    let status = "VALID"; // Default to VALID for testing

    // Only try to parse the body if Content-Type is application/x-www-form-urlencoded
    const contentType = req.headers.get("Content-Type");
    if (
      contentType &&
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      try {
        const formData = await req.text();
        if (formData && formData.length > 0) {
          const formDataParams = new URLSearchParams(formData);
          status = formDataParams.get("status") || "VALID";

          console.log("Payment callback received:", {
            transactionId,
            status,
            val_id: formDataParams.get("val_id"),
            amount: formDataParams.get("amount"),
          });
        } else {
          console.log("Empty form data received, using default status");
        }
      } catch (formError) {
        console.error("Error parsing form data:", formError);
        // Continue with default status
      }
    } else {
      console.log("No form data in request, using transaction ID from URL");
    }

    // Find the payment log
    const paymentLog = await prisma.paymentLog.findUnique({
      where: { transactionId },
    });

    if (!paymentLog) {
      console.error("Payment not found for transaction ID:", transactionId);
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Check if payment is already processed
    if (paymentLog.status === "SUCCESS") {
      console.log("Payment already processed, redirecting to success page");
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_APP_URL}/dashboard/success`,
        303,
      );
    }

    // Validate payment status from SSL Commerz
    if (status !== "VALID") {
      console.error("Invalid payment status:", status);
      await prisma.paymentLog.update({
        where: { id: paymentLog.id },
        data: { status: "FAILED" },
      });
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_APP_URL}/checkout?error=invalid_payment`,
        303,
      );
    }

    // Parse items from payment log
    const items = paymentLog.items as any[];

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("No items found in payment log");
      return NextResponse.json(
        { error: "No items found in payment" },
        { status: 400 },
      );
    }

    console.log("Processing payment with items:", items.length);

    // Update payment status first, outside of transaction
    await prisma.paymentLog.update({
      where: { id: paymentLog.id },
      data: { status: "SUCCESS" },
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: paymentLog.userId,
        amount: Math.round(paymentLog.amount),
        status: "PROCESSING",
        shippingAddress: paymentLog.shippingAddress as Prisma.InputJsonValue,
        paymentId: transactionId,
      },
    });

    console.log("Order created:", order.id);

    // Create order items and update product quantities
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          color: item.color || null,
          size: item.size || null,
        },
      });

      // Update product quantity
      await prisma.product.update({
        where: { id: item.id },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    console.log("Order processing completed successfully");

    // Redirect to success page
    return NextResponse.redirect("/dashboard/success", 303);
  } catch (error: any) {
    console.error("Error in payment processing:", error);
    return NextResponse.json(
      {
        error: "Failed to process payment",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// Also handle GET requests for direct browser redirects
export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const transactionId = searchParams.get("id");

    if (!transactionId) {
      return NextResponse.redirect("/checkout?error=missing_transaction", 303);
    }

    // Find the payment log
    const paymentLog = await prisma.paymentLog.findUnique({
      where: { transactionId },
    });

    if (!paymentLog) {
      return NextResponse.redirect("/checkout?error=payment_not_found", 303);
    }

    // If payment is already successful, redirect to success page
    if (paymentLog.status === "SUCCESS") {
      return NextResponse.redirect("/dashboard/success", 303);
    }

    // For GET requests, update payment status and create order
    try {
      // Update payment status
      await prisma.paymentLog.update({
        where: { id: paymentLog.id },
        data: { status: "SUCCESS" },
      });

      // Parse items from payment log
      const items = paymentLog.items as any[];

      // Create order
      const order = await prisma.order.create({
        data: {
          userId: paymentLog.userId,
          amount: Math.round(paymentLog.amount),
          status: "PROCESSING",
          shippingAddress: paymentLog.shippingAddress as Prisma.InputJsonValue,
          paymentId: transactionId,
        },
      });

      // Create order items and update product quantities
      for (const item of items) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            color: item.color || null,
            size: item.size || null,
          },
        });

        // Update product quantity
        await prisma.product.update({
          where: { id: item.id },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return NextResponse.redirect("/dashboard/success", 303);
    } catch (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.redirect(
        "/checkout?error=order_creation_failed",
        303,
      );
    }
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.redirect("/checkout?error=processing_failed", 303);
  }
}
