import "server-only";

import { auth } from "@/auth";

import type { ExtendedUser } from "@/types/next-auth";

export async function getCurrentUser(): Promise<ExtendedUser | undefined> {
  try {
    const session = await auth();
    return session?.user ?? undefined;
  } catch (error) {
    console.error("Error getting current user:", error);
    return undefined;
  }
}

export async function getRequiredUser(): Promise<ExtendedUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
