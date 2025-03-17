"use server";

import { auth } from "@/auth";
import { CartItem } from "@/utils/cart";

import { prisma } from "@/lib/db";

export const successfulPayments = async () => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { message: "unauthorized" };

  try {
    const payments = await prisma.payment.findMany({
      where: {
        status: PaymentStatus.SUCCESS,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: payments };
  } catch (error) {
    return { success: false, error: "Failed to create payment log" };
    return { success: false, error: "Failed to create payment log" };
  }
};
export const successfulUserPayments = async () => {
  const session = await auth();
  try {
    const payments = await prisma.payment.findMany({
      where: {
        userId: session?.user.id,
        status: PaymentStatus.SUCCESS,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: payments };
  } catch (error) {
    return { success: false, error };
  }
};
export const failedPayments = async () => {
  try {
    const payments = await prisma.payment.findMany({
      where: {
        status: PaymentStatus.FAILED,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { success: true, data: logs };
  } catch (error) {
    return { success: false, error };
  }
};
export const getAnalytics = async () => {
  try {
    const currentDate = new Date();
    const previousMonth = new Date(
      currentDate.setMonth(currentDate.getMonth() - 1),
    );

    const [
      currentCustomers,
      previousCustomers,
      currentMonthPayments,
      previousMonthPayments,
    ] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: "USER",
        },
      }),
      prisma.user.findMany({
        where: {
          role: "USER",
          createdAt: {
            lt: previousMonth,
          },
        },
      }),
      prisma.payment.findMany({
        where: {
          status: PaymentStatus.SUCCESS,
          createdAt: {
            gte: previousMonth,
          },
        },
      }),
      prisma.payment.findMany({
        where: {
          status: PaymentStatus.SUCCESS,
          createdAt: {
            lt: previousMonth,
          },
        },
      }),
    ]);

    return {
      success: true,
      data: {
        currentCustomers,
        previousCustomers,
        currentMonthPayments,
        previousMonthPayments,
      },
    };
  } catch (error) {
    console.error("Analytics Error:", error);
    return {
      success: false,
      error: "Failed to fetch analytics data",
    };
  }
}
