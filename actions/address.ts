"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { addressSchema, TAddress } from "@/lib/validations/product";

export const getAddressess = async () => {
  try {
    const addresses = await prisma.address.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return { success: true, data: addresses };
  } catch (error) {
    console.error("[LISTINGS_GET]", error);
    return { success: false, error: "Failed to fetch product" };
  }
};
export const getAdress = async (id: string) => {
  try {
    const address = await prisma.address.findUnique({
      where: {
        id: id,
      },
    });

    return { success: true, data: address };
  } catch (err) {
    console.log(err);
    return { success: false, error: "Failed to fetch product" };
  }
};
export const addAddress = async (data: TAddress) => {
  const session = await auth();
  if (!session?.user) return { message: "unauthorized" };

  const result = addressSchema.safeParse(data);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (result.success) {
    try {
      const res = await prisma.address.create({
        data: {
          ...result.data,
          userId: session?.user.id!,
        },
      });
      revalidatePath("/cart", "page");
      return { success: "address has been created successfully", res };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
};
export const updateAddress = async (data: TAddress, id: string) => {
  const session = await auth();
  if (!session?.user) return { message: "unauthorized" };

  const result = addressSchema.safeParse(data);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (result.success) {
    try {
      const res = await prisma.address.update({
        where: {
          id: id,
        },
        data: {
          ...result.data,
        },
      });
      // revalidatePath("/admin/banner", "page");
      revalidatePath("/cart", "page");
      return { success: "address has been updated successfully", res };
    } catch (error) {
      return {
        error: error,
      };
    }
  }
};
export const deleteAddress = async (id: string) => {
  const session = await auth();
  if (!session?.user) return { message: "unauthorized" };

  try {
    const res = await prisma.address.delete({
      where: {
        id: id,
      },
    });
    //  revalidatePath("/admin/banner", "page");
    revalidatePath("/cart", "page");
    return { success: "address has been deleted successfully" };
  } catch (error) {
    return {
      error: error,
    };
  }
};
