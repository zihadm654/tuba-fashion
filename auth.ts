// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "@/lib/db"
import authConfig from "@/auth.config";
import NextAuth from "next-auth";

// Remove adapter from main config
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  ...authConfig,
});
