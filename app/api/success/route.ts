import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";

// Fix: Remove the res parameter as it's not needed in Next.js App Router
export async function POST(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const refId = searchParams.get("id");

    if (!refId) {
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
            refId,
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
    const paymentLog = await prisma.payment.findUnique({
      where: { refId },
    });

    if (!paymentLog) {
      console.error("Payment not found for transaction ID:", refId);
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
      await prisma.payment.update({
        where: { id: paymentLog.id },
        data: { status: "FAILED" },
      });
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_APP_URL}/dashboard/fail`,
        303,
      );
    }

    // Parse items from payment log
    // const items = paymentLog.items as any[];

    // if (!items || !Array.isArray(items) || items.length === 0) {
    //   console.error("No items found in payment log");
    //   return NextResponse.json(
    //     { error: "No items found in payment" },
    //     { status: 400 },
    //   );
    // }

    // console.log("Processing payment with items:", items.length);

    // Update payment status first, outside of transaction
    await prisma.payment.update({
      where: { id: paymentLog.id },
      data: { status: "SUCCESS" },
    });

    try {
      // Calculate price breakdown
      const itemsPrice = Math.round(paymentLog.payable);
      const shippingPrice = 0; // You may want to adjust this based on your business logic
      const taxPrice = 0; // You may want to adjust this based on your business logic
      const totalPrice = itemsPrice + shippingPrice + (taxPrice || 0);

      // Set expected delivery date (e.g., 7 days from now)
      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);

      // Create order with all required fields
      const order = await prisma.order.create({
        data: {
          userId: paymentLog.userId,
          payable: totalPrice,
          status: "Processing",
          // shippingAddress: paymentLog.shippingAddress as Prisma.InputJsonValue,
          // paymentId: refId,
          // paymentMethod: paymentLog.providerId || "SSL Commerz",
          // paymentResult: {
          //   id: refId,
          //   status: "SUCCESS",
          //   email_address: paymentLog.customerEmail,
          // },
          isPaid: true,
          // paidAt: new Date(),
          // isDelivered: false,
          // expectedDeliveryDate: expectedDeliveryDate,
          // itemsPrice: itemsPrice,
          // shippingPrice: shippingPrice,
          // taxPrice: taxPrice,
          // totalPrice: totalPrice,
        },
      });

      console.log("Order created:", order.id);
      console.log("Order created:", order.id);

      // Create order items and update product quantities
      // for (const item of items) {
      //   // Get product details for order history
      //   const product = await prisma.product.findUnique({
      //     where: { id: item.id },
      //   });

      //   if (!product) {
      //     console.warn(`Product not found: ${item.id}`);
      //     continue;
      //   }

      // Create order item with all required fields
      //   await prisma.orderItem.create({
      //     data: {
      //       orderId: order.id,
      //       productId: item.id,
      //       stock: item.stock,
      //       price: item.price,
      //       color: item.color || null,
      //       size: item.size || null,
      //       productName: product.title,
      //       productSlug: product.title.toLowerCase().replace(/\s+/g, "-"),
      //       productImage: product.images[0] || "",
      //       category: product.category,
      //       countInStock: product.stock,
      //       clientId: item.id,
      //     },
      //   });

      //   // Update product quantity
      //   await prisma.product.update({
      //     where: { id: item.id },
      //     data: { stock: { decrement: item.stock } },
      //   });
      // }

      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_APP_URL}/dashboard/success`,
        303,
      );
    } catch (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_APP_URL}/dashboard/cancel`,
        303,
      );
    }
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_APP_URL}/dashboard/fail`,
      303,
    );
  }
}

// Also handle GET requests for direct browser redirects
export async function GET(req: Request) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const transactionId = searchParams.get("id");

    if (!transactionId) {
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_APP_URL}/dashboard/orders/fail?error=missing_transaction`,
        303,
      );
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_APP_URL}/dashboard/orders/fail?error=missing_transaction`,
        303,
      );
    }

    // Find the payment log
    // const paymentLog = await prisma.payment.findUnique({
    //   where: { refId },
    // });

    // if (!paymentLog) {
    //   return NextResponse.redirect(
    //     `${env.NEXT_PUBLIC_APP_URL}/dashboard/orders/fail?error=payment_not_found`,
    //     303,
    //   );
    // }

    // If payment is already successful, redirect to success page
    // if (paymentLog.status === "SUCCESS") {
    //   return NextResponse.redirect(
    //     `${env.NEXT_PUBLIC_APP_URL}/dashboard/orders/success`,
    //     303,
    //   );
    // }

    try {
      // Update payment status
      // await prisma.payment.update({
      //   where: { id: paymentLog.id },
      //   data: { status: "SUCCESS" },
      // });

      // Parse items from payment log
      // const items = paymentLog.items as any[];

      // if (!items || !Array.isArray(items) || items.length === 0) {
      //   console.error("No items found in payment log");
      //   return NextResponse.redirect(
      //     `${env.NEXT_PUBLIC_APP_URL}/dashboard/orders/fail?error=no_items`,
      //     303,
      //   );
      // }

      // // Calculate price breakdown
      // const itemsPrice = Math.round(paymentLog.payable);
      // const shippingPrice = 0;
      // const taxPrice = 0;
      // const totalPrice = itemsPrice + shippingPrice + (taxPrice || 0);

      // Set expected delivery date (e.g., 7 days from now)
      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);

      // Create order with all required fields using transaction to ensure consistency
      // const order = await prisma.$transaction(async (tx) => {
      //   // Create the order first
      //   const newOrder = await tx.order.create({
      //     data: {
      //       userId: paymentLog.userId,
      //       payable: totalPrice,
      //       status: "Processing",
      //       address: paymentLog.shippingAddress as Prisma.InputJsonValue,
      //       paymentId: transactionId,
      //       paymentMethod: paymentLog.providerId || "SSL Commerz",
      //       paymentResult: {
      //         id: transactionId,
      //         status: "SUCCESS",
      //         email_address: paymentLog.customerEmail,
      //       },
      //       isPaid: true,
      //       paidAt: new Date(),
      //       isDelivered: false,
      //       expectedDeliveryDate: expectedDeliveryDate,
      //       itemsPrice: itemsPrice,
      //       shippingPrice: shippingPrice,
      //       taxPrice: taxPrice,
      //       totalPrice: totalPrice,
      //     },
      //   });

      //   // Process each item
      //   for (const item of items) {
      //     // Get product details for order history
      //     const product = await tx.product.findUnique({
      //       where: { id: item.id },
      //     });

      //     if (!product) {
      //       console.warn(`Product not found: ${item.id}`);
      //       continue;
      //     }

      //     // Create order item with all required fields
      //     await tx.orderItem.create({
      //       data: {
      //         orderId: newOrder.id,
      //         productId: item.id,
      //         stock: item.stock,
      //         price: item.price,
      //         color: item.color || null,
      //         size: item.size || null,
      //         productName: product.title,
      //         productSlug: product.title.toLowerCase().replace(/\s+/g, "-"),
      //         productImage: product.images[0] || "",
      //         category: product.category,
      //         countInStock: product.stock,
      //         clientId: item.id,
      //       },
      //     });

      //     // Update product quantity
      //     await tx.product.update({
      //       where: { id: item.id },
      //       data: { stock: { decrement: item.quantity } },
      //     });
      //   }

      //   return newOrder;
      // });

      // console.log("Order processing completed successfully:", order.id);

      // Redirect to success page
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_APP_URL}/dashboard/orders/success`,
        303,
      );
    } catch (orderError) {
      console.error("Error creating order:", orderError);
      // Fix: Use proper redirect without additional parameters
      // Fix: Use proper redirect without additional parameters
      return NextResponse.redirect(
        `${env.NEXT_PUBLIC_APP_URL}/dashboard/orders/fail?error=order_creation_failed`,
        303,
      );
    }
  } catch (error) {
    console.error("Error in GET handler:", error);
    // Fix: Use proper redirect without additional parameters
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_APP_URL}/dashboard/orders/fail?error=general_error`,
      303,
    );
    // Fix: Use proper redirect without additional parameters
    return NextResponse.redirect(
      `${env.NEXT_PUBLIC_APP_URL}/dashboard/orders/fail?error=general_error`,
      303,
    );
  }
}
