"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function getUserWishlists() {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { wishlist: true },
    });
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
}
export async function addWishList(productId: string) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        wishlist: {
          connect: {
            id: productId,
          },
        },
      },
      include: { wishlist: true },
    });

    return { success: true, data: user };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
}
export async function deleteWishList(productId: string) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        wishlist: {
          disconnect: {
            id: productId,
          },
        },
      },
      include: { wishlist: true },
    });

    return { success: true, data: user };
  } catch (error: any) {
    console.error("Error fetching user orders:", error);
    return { success: false, error: error.message };
  }
}
