import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserNameForm } from "@/components/forms/user-name-form";
import { UserRoleForm } from "@/components/forms/user-role-form";

export const metadata = constructMetadata({
  title: "Settings – Tuba Fashion",
  description: "Configure your account and website settings.",
});

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="divide-muted divide-y pb-10">
        <UserNameForm
          user={{ id: session?.user.id, name: session.user.name || "" }}
        />
        {session.user.role === "ADMIN" && (
          <UserRoleForm
            user={{ id: session.user.id, role: session.user.role }}
          />
        )}
        <DeleteAccountSection />
      </div>
    </>
  );
}
