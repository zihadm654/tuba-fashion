"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { categorySchema, TCategory } from "@/lib/validations/product";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        banners: true,
        // products: true,
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function getCategory(id: string) {
  try {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId && !id) {
      return { success: false, error: "Unauthorized" };
    }

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        banners: true,
        // products: true,
      },
    });

    return { success: true, data: category };
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export async function addCategory(data: TCategory) {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const result = categorySchema.safeParse(data);
    if (!result.success) {
      return { success: false, error: result.error.format() };
    }

    // Create the category first
    const category = await prisma.category.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });

    // If a banner ID is provided, update the banner to connect it to this category
    if (data.bannerId) {
      await prisma.banner.update({
        where: { id: data.bannerId },
        data: {
          categoryId: category.id,
        },
      });
    }

    // Get the updated category with banners included
    const updatedCategory = await prisma.category.findUnique({
      where: { id: category.id },
      include: {
        banners: true,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");
    return { success: true, data: updatedCategory };
  } catch (error) {
    console.error("[CATEGORY_CREATE]", error);
    return { success: false, error: "Internal Server Error" };
  }
}

export const updateCategory = async (data: TCategory, categoryId: string) => {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const result = categorySchema.safeParse(data);
    if (!result.success) {
      return { success: false, error: result.error.format() };
    }

    // First, get the current category to check if it has any banners
    const currentCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { banners: true },
    });

    if (!currentCategory) {
      return { success: false, error: "Category not found" };
    }

    // Update the category with basic information
    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        title: data.title,
        description: data.description,
      },
    });

    // If a banner ID is provided, update the banner to connect it to this category
    if (data.bannerId) {
      // If the category already has banners, we need to handle them
      if (currentCategory.banners && currentCategory.banners.length > 0) {
        // Update existing banners to remove their connection to this category
        await prisma.banner.updateMany({
          where: { categoryId: categoryId },
          data: { categoryId: null },
        });
      }

      // Connect the new banner to this category
      await prisma.banner.update({
        where: { id: data.bannerId },
        data: { categoryId: categoryId },
      });
    }

    // Get the updated category with banners included
    const finalCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        banners: true,
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, data: finalCategory };
  } catch (error) {
    console.error("[CATEGORY_UPDATE]", error);
    return { success: false, error: "Internal Server Error" };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.category.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return { success: false, error: "Internal Server Error" };
  }
};
