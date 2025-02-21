import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const user = await auth();
  if (!user || user.user.role !== "ADMIN") redirect("/login");

  return <>{children}</>;
}
