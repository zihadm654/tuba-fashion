import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { getUserSubscriptionPlan } from "@/lib/subscription";
import { constructMetadata } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DashboardHeader } from "@/components/dashboard/header";
import { BillingInfo } from "@/components/pricing/billing-info";
import { Icons } from "@/components/shared/icons";

export const metadata = constructMetadata({
  title: "Billing – Tuba Fashion",
  description: "Manage billing and your subscription plan.",
});

export default async function BillingPage() {
  const session = await auth();

  let userSubscriptionPlan;
  if (session?.user && session.user.id && session.user.role === "USER") {
    userSubscriptionPlan = await getUserSubscriptionPlan(session.user.id);
  } else {
    redirect("/login");
  }

  return (
    <>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <Alert className="pl-14!">
          <Icons.warning />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription className="text-balance">
            Tuba Fashion app is a demo app using a Stripe test environment. You
            can find a list of test card numbers on the{" "}
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a>
            .
          </AlertDescription>
        </Alert>
        <BillingInfo userSubscriptionPlan={userSubscriptionPlan} />
      </div>
    </>
  );
}
