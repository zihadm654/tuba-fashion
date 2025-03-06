"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { bannerSchema, TBanner } from "@/lib/validations/product";

export const getBanners = async () => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return { success: true, data: banners };
  } catch (error) {
    console.error("[LISTINGS_GET]", error);
    return { success: false, error: "Failed to fetch product" };
  }
};
export const getBanner = async (id: string) => {
  try {
    const banner = await prisma.banner.findUnique({
      where: {
        id: id,
      },
    });

    return { success: true, data: banner };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Failed to fetch product" };
  }
};
export const addBanner = async (data: TBanner) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { message: "unauthorized" };

  const result = bannerSchema.safeParse(data);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (result.success) {
    try {
      const res = await prisma.banner.create({
        data: {
          ...result.data,
        },
      });
      revalidatePath("/admin/banner", "page");
      revalidatePath("/", "page");
      return { success: "banner has been created successfully", res };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
};
export const updateBanner = async (data: TBanner, id: string) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { message: "unauthorized" };

  const result = bannerSchema.safeParse(data);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (result.success) {
    try {
      const res = await prisma.banner.update({
        where: {
          id: id,
        },
        data: {
          ...result.data,
        },
      });
      revalidatePath("/admin/banner", "page");
      revalidatePath("/", "page");
      return { success: "product has been updated successfully", res };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
};
export const deleteBanner = async (id: string) => {
  const session = await auth();
  if (session?.user.role !== "ADMIN") return { message: "unauthorized" };

  try {
    const res = await prisma.banner.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/admin/banner", "page");
    revalidatePath("/", "page");
    return { success: "banner has been deleted successfully" };
  } catch (error) {
    return {
      error: error,
    };
  }
};
