"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function getUserOrders() {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    const cart = await prisma.cart.findUniqueOrThrow({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                brand: true,
                categories: true,
              },
            },
          },
        },
      },
    });
    return { success: true, data: cart };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
}
export async function addCart(count: number, productId: string) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    if (count < 1) {
      await prisma.cartItem.delete({
        where: { UniqueCartItem: { cartId: userId, productId } },
      });
    } else {
      await prisma.cart.upsert({
        where: {
          userId,
        },
        create: {
          user: {
            connect: {
              id: userId,
            },
          },
        },
        update: {
          items: {
            upsert: {
              where: {
                UniqueCartItem: {
                  cartId: userId,
                  productId,
                },
              },
              update: {
                count,
              },
              create: {
                productId,
                count,
              },
            },
          },
        },
      });
    }

    const cart = await prisma.cart.findUniqueOrThrow({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return { success: true, data: cart };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
}
