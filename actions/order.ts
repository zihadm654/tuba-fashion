"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

type OrderItemInput = {
  productId: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
};

type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
};

export async function createOrder(
  items: OrderItemInput[],
  totalAmount: number,
  shippingAddress: ShippingAddress,
  paymentId?: string,
) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Calculate total amount from items as a safety check
    const calculatedTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    if (calculatedTotal !== totalAmount) {
      return { success: false, error: "Amount mismatch" };
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId,
          amount: totalAmount,
          status: "PROCESSING",
          shippingAddress: shippingAddress,
          paymentId,
        },
      });

      // Create order items
      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            color: item.color,
            size: item.size,
          },
        });

        // Update product quantity
        await tx.product.update({
          where: { id: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }

      return order;
    });

    revalidatePath("/products");
    revalidatePath("/dashboard/orders");

    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message };
  }
}

export async function getUserOrders() {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                title: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: orders };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                title: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    return { success: true, data: order };
  } catch (error: any) {
    console.error("Error fetching order:", error);
    return { success: false, error: error.message };
  }
}
