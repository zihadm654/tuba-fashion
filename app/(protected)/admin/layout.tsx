import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function Dashboard({ children }: ProtectedLayoutProps) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  return <>{children}</>;
}
