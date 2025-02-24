import { auth } from "@/auth";

import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";

export const metadata = constructMetadata({
  title: "Dashboard - Tuba Fasion",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await auth();

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text={`Current Role : ${user?.user.role} — Change your role in settings.`}
      />
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="post" />
        <EmptyPlaceholder.Title>No content created</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any content yet. Start creating content.
        </EmptyPlaceholder.Description>
        <Button>Add Content</Button>
      </EmptyPlaceholder>
    </>
  );
}
