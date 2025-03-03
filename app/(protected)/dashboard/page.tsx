import { Suspense } from "react";
import { successfulUserPayments } from "@/actions/payment";
import { auth } from "@/auth";

import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import TransactionsList from "@/components/dashboard/transactions-list";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { SkeletonSection } from "@/components/shared/section-skeleton";

export const metadata = constructMetadata({
  title: "Dashboard - Tuba Fasion",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await auth();
  const paymentSuccess = await successfulUserPayments();
  if (paymentSuccess.data?.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="post" />
        <EmptyPlaceholder.Title>No content created</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          You don&apos;t have any content yet. Start creating content.
        </EmptyPlaceholder.Description>
        <Button>Add Content</Button>
      </EmptyPlaceholder>
    );
  }
  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text={`Current Role : ${user?.user.role} — Change your role in settings.`}
      />
      {paymentSuccess?.data?.length! > 0 && (
        <Suspense fallback={<SkeletonSection />}>
          <TransactionsList
            transactions={paymentSuccess?.data || []}
            title="Successful"
          />
        </Suspense>
      )}
    </>
  );
}
