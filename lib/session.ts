import "server-only";

import { cache } from "react";
import { auth } from "@/auth";

import type { ExtendedUser } from "@/types/next-auth";

export const getCurrentUser = cache(
  async (): Promise<ExtendedUser | undefined> => {
    const session = await auth();
    return session?.user ?? undefined;
  },
);
