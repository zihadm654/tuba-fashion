"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { productSchema, TProduct } from "@/lib/validations/product";

export const getProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("[LISTINGS_GET]", error);
    return { success: false, error: "Failed to fetch product" };
  }
};
export const getProduct = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    return { success: true, data: product };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Failed to fetch product" };
  }
};
const CATEGORIES = {
  MEN: "men",
  WOMEN: "women",
  KIDS: "kids",
} as const;

type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];

export const getProductByCat = async (cat: Category) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: cat,
        status: "published",
      },
    });

    return { success: true, data: products };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Failed to fetch product" };
  }
};

export async function getUserProducts(userId: string) {
  const session = await auth();
  if (!session?.user || session?.user.id !== userId) {
    throw new Error("Unauthorized");
  }
  try {
    const listings = await prisma.product.findMany({
      where: {
        userId: userId,
      },
    });
    return { success: true, data: listings };
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return { success: false, error: "Failed to fetch user listings" };
  }
}

export const addProduct = async (data: TProduct, userId: string) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { message: "unauthorized" };

  const result = productSchema.safeParse(data);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (result.success) {
    try {
      const flattenUrls = result.data.images.flatMap((urlString) =>
        urlString.split(",").map((url) => url.trim()),
      );
      const res = await prisma.product.create({
        data: {
          ...result.data,
          images: flattenUrls,
          userId,
        },
      });
      revalidatePath("/admin/products");
      return { success: "product has been created successfully", res };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
};

export const updateProduct = async (
  data: TProduct,
  id: string,
  userId: string,
) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { message: "unauthorized" };

  const result = productSchema.safeParse(data);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (result.success) {
    try {
      const flattenUrls = result.data.images.flatMap((urlString) =>
        urlString.split(",").map((url) => url.trim()),
      );
      const res = await prisma.product.update({
        where: {
          id: id,
        },
        data: {
          ...result.data,
          images: flattenUrls,
          userId,
        },
      });
      return { success: "product has been updated successfully", res };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
  revalidatePath("/admin/products");
};
export const deleteProduct = async (id: string) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { message: "unauthorized" };

  try {
    const res = await prisma.product.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/admin/products");
    return { success: "product has been deleted successfully" };
  } catch (error) {
    return {
      error: error,
    };
  }
};
