"use server";

import { UTApi } from "uploadthing/server";

import { getCurrentUser } from "@/lib/session";

export const imageRemove = async (imageKey: string) => {
  const utapi = new UTApi();
  const user = await getCurrentUser();
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
