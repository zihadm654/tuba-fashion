import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export const metadata = constructMetadata({
  title: "Order Successful – Tuba Fashion",
  description: "Your order has been successfully placed.",
});

export default async function SuccessPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <MaxWidthWrapper className="py-20">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold">Order Successful!</h1>
        
        <p className="text-muted-foreground max-w-md">
          Thank you for your purchase. Your order has been received and is being processed.
          You will receive an email confirmation shortly.
        </p>
        
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard/orders">View My Orders</Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
