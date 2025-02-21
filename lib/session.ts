"use server";

import "server-only";

import { cache } from "react";
import { auth } from "@/auth";
import { User } from "next-auth";

export const getCurrentUser = cache(async (): Promise<User | undefined> => {
  const session = await auth();
  if (!session?.user) {
    return undefined;
  }
  return session.user;
});
