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
        products: true,
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
        products: true,
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

    const category = await prisma.category.create({
      data: {
        title: data.title,
        description: data.description,
        ...(data.bannerId && {
          banners: {
            connect: { id: data.bannerId },
          },
        }),
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, data: category };
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

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: {
        title: data.title,
        description: data.description,
        ...(data.bannerId && {
          banners: {
            connect: { id: data.bannerId },
          },
        }),
      },
    });

    revalidatePath("/admin/categories");
    return { success: true, data: updatedCategory };
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
