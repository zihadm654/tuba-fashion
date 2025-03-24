"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import {
  bannerSchema,
  brandSchema,
  TBanner,
  TBrand,
} from "@/lib/validations/product";

export const getBrands = async () => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return { success: true, data: brands };
  } catch (error) {
    console.error("[LISTINGS_GET]", error);
    return { success: false, error: "Failed to fetch product" };
  }
};
export const getBrand = async (id: string) => {
  try {
    const brand = await prisma.brand.findUnique({
      where: {
        id: id,
      },
    });

    return { success: true, data: brand };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Failed to fetch product" };
  }
};
export const addBrand = async (data: TBrand) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { message: "unauthorized" };

  const result = brandSchema.safeParse(data);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (result.success) {
    try {
      const res = await prisma.brand.create({
        data: {
          ...result.data,
        },
      });
      revalidatePath("/admin/banner", "page");
      revalidatePath("/", "page");
      return { success: "brand has been created successfully", res };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
};
export const updateBrand = async (data: TBrand, id: string) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { message: "unauthorized" };

  const result = brandSchema.safeParse(data);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (result.success) {
    try {
      const res = await prisma.brand.update({
        where: {
          id: id,
        },
        data: {
          ...result.data,
        },
      });
      revalidatePath("/admin/banner", "page");
      revalidatePath("/", "page");
      return { success: "brand has been updated successfully", res };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
};
export const deleteBrand = async (id: string) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { message: "unauthorized" };

  try {
    // First check if the brand exists
    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      return { error: "Brand not found" };
    }

    // Check if any products are using this brand
    const productsUsingBrand = await prisma.product.findMany({
      where: { brandId: id },
      select: { id: true },
    });

    if (productsUsingBrand.length > 0) {
      return {
        error:
          "Cannot delete brand because it is associated with products. Please reassign or delete those products first.",
        productsCount: productsUsingBrand.length,
      };
    }

    // If no products are using this brand, proceed with deletion
    const res = await prisma.brand.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/admin/banner", "page");
    revalidatePath("/", "page");
    return { success: "brand has been deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting brand:", error);

    // Provide more specific error messages based on error type
    if (error.code === "P2025") {
      return { error: "Brand not found" };
    } else if (error.code === "P2003") {
      return {
        error: "Cannot delete brand because it is referenced by products",
      };
    }

    return {
      error: "Failed to delete brand: " + (error.message || String(error)),
    };
  }
};
