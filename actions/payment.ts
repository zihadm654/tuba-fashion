"use server";

import { auth } from "@/auth";
import { CartItem } from "@/utils/cart";

import { prisma } from "@/lib/db";

interface ShippingDetails {
  address: string;
  city: string;
  phone: string;
  postcode: string;
}

export async function createPaymentLog(
  items: CartItem[],
  shippingDetails: ShippingDetails,
  payable: number,
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // const paymentLog = await prisma.payment.create({
    //   data: {
    //     userId: session.user.id,
    //     payable,
    //     items: items as any,
    //     status: "PENDING",
    //     refId: `TF-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    //     shippingAddress: shippingDetails as any,
    //     customerEmail: session.user.email || "",
    //     paymentMethod: "SSL_COMMERZ",
    //   },
    // });

    // return { success: true, data: paymentLog };
  } catch (error) {
    return { success: false, error: "Failed to create payment log" };
  }
}

export async function getPaymentLogs() {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const logs = await prisma.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: logs };
  } catch (error) {
    return { success: false, error: "Failed to fetch payment logs" };
  }
}
