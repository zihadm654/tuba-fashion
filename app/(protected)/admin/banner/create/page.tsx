import { auth } from "@/auth";

import { DashboardHeader } from "@/components/dashboard/header";
import { AddBanner } from "@/components/forms/add-banner";

const Page = async () => {
  const session = await auth();

  if (!session || !session.user.id) {
    return null; // or redirect to login
  }

  return (
    <>
      <DashboardHeader heading="Add Banner" text="Create new banner" />
      <AddBanner />
    </>
  );
};

export default Page;
