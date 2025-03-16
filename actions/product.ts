"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { productSchema, TProduct } from "@/lib/validations/product";

interface FilterOptions {
  category?: string;
  priceRange?: string;
  sortBy?: string;
  title?: string;
}

export const getProducts = async (filters?: FilterOptions) => {
  try {
    const where: any = {
      status: "published",
    };

    if (filters?.title) {
      where.title = {
        contains: filters.title,
        mode: "insensitive",
      };
    }

    if (filters?.category && filters.category !== "all") {
      where.category = filters.category;
    }

    if (filters?.priceRange && filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      where.price = {
        gte: min,
        ...(max !== undefined && { lte: max }),
      };
      if (filters.priceRange === "200-above") {
        where.price = { gte: 200 };
      }
    }

    let orderBy: any = { createdAt: "desc" };
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          orderBy = { price: "asc" };
          break;
        case "price_desc":
          orderBy = { price: "desc" };
          break;
        default:
          orderBy = { createdAt: "desc" };
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        brand: true,
        categories: true,
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
    const product = await prisma.product.findUniqueOrThrow({
      where: { id: id },
      include: {
        categories: true,
        brand: true,
      },
    });
    return { success: true, data: product };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Failed to fetch product" };
  }
};

export const getProductsByCat = async (cat: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categories: {
          some: {
            title: cat,
          },
        },
        status: "published",
      },
      include: {
        categories: true,
        brand: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!products.length) {
      return { success: false, error: "No products found in this category" };
    }

    return { success: true, data: products };
  } catch (err) {
    console.error("Error fetching products by category:", err);
    return { success: false, error: "Failed to fetch products" };
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
      include: {
        categories: true,
        brand: true,
      },
      orderBy: {
        createdAt: "desc",
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

      // First check if brand exists
      if (!result.data.brands?.[0]) {
        return { error: "Brand is required" };
      }

      const res = await prisma.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          images: flattenUrls,
          tags: result.data.tags || [],
          price: result.data.price,
          discount: result.data.discount,
          discountStart: result.data.discountStart,
          discountEnd: result.data.discountEnd,
          stock: result.data.stock,
          status: result.data.status,
          color: result.data.color,
          size: result.data.size,
          isFeatured: result.data.isFeatured,
          isAvailable: result.data.isAvailable,
          isPhysical: result.data.isPhysical,
          febric: result.data.febric,
          userId,
          brandId: result.data.brands[0], // Direct assignment instead of connect
          categories: {
            connect: result.data.categories.map((id) => ({ id })),
          },
        },
        include: { // Include relations in response
          brand: true,
          categories: true,
        },
      });

      revalidatePath("/admin/products", "page");
      revalidatePath("/", "layout");
      return { success: "product has been created successfully", res };
    } catch (error) {
      console.error("Error creating product:", error);
      return { error: "Failed to create product" };
    }
  } else {
    return { error: result.error.format() };
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

      // First check if brand exists
      if (!result.data.brands?.[0]) {
        return { error: "Brand is required" };
      }

      const res = await prisma.product.update({
        where: { id },
        data: {
          title: result.data.title,
          description: result.data.description,
          images: flattenUrls,
          tags: result.data.tags || [],
          price: result.data.price,
          discount: result.data.discount,
          discountStart: result.data.discountStart,
          discountEnd: result.data.discountEnd,
          stock: result.data.stock,
          status: result.data.status,
          color: result.data.color,
          size: result.data.size,
          isFeatured: result.data.isFeatured,
          isAvailable: result.data.isAvailable,
          isPhysical: result.data.isPhysical,
          febric: result.data.febric,
          userId,
          brandId: result.data.brands[0], // Direct assignment instead of connect
          categories: {
            set: result.data.categories.map((id) => ({ id })),
          },
        },
        include: { // Include relations in response
          brand: true,
          categories: true,
        },
      });

      revalidatePath("/admin/products", "page");
      revalidatePath("/", "layout");
      return { success: "product has been updated successfully", res };
    } catch (error) {
      console.error("Error updating product:", error);
      return { error: "Failed to update product" };
    }
  } else {
    return { error: result.error.format() };
  }
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
    revalidatePath("/admin/products", "page");
    revalidatePath("/", "layout");
    return { success: "product has been deleted successfully" };
  } catch (error) {
    return {
      error: error,
    };
  }
};
