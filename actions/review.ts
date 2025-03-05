"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function createReview(
  productId: string,
  rating: number,
  comment?: string | undefined,
) {
  try {
    const session = await auth();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (!productId || !rating) {
      throw new Error("Missing required fields");
    }

    const review = await prisma.review.create({
      data: {
        productId,
        rating,
        comment,
        userId: session.user.id!,
      },
    });

    return review;
  } catch (error) {
    console.error("[CREATE_REVIEW]", error);
    throw new Error("Failed to create review");
  }
}

export async function getProductReviews(productId: string) {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reviews;
  } catch (error) {
    console.error("[GET_REVIEWS]", error);
    throw new Error("Failed to fetch reviews");
  }
}
