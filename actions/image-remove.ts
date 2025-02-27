"use server";

import { auth } from "@/auth";
import { UTApi } from "uploadthing/server";

export const imageRemove = async (imageKey: string) => {
  const utapi = new UTApi();
  const session = await auth();

  if (!session?.user) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await utapi.deleteFiles([imageKey]);
    return {
      success: true,
      message: "Image deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      message: "Failed to delete image",
    };
  }
};
export const imgRemove = async (imageKey: string) => {
  const utapi = new UTApi();
  const user = await auth();
  if (!user) return new Response("Unauthorized", { status: 401 });
  try {
    await utapi.deleteFiles(imageKey);
    return {
      success: true,
      status: 401,
    };
  } catch (error) {
    return { success: false };
  }
};
