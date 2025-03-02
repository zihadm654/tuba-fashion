import { auth } from "@/auth";

import { DashboardHeader } from "@/components/dashboard/header";
import { AddProduct } from "@/components/forms/add-product";

const Page = async () => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return null; // or redirect to login
  }

  return (
    <>
      <DashboardHeader heading="Add project" text="Create new project" />
      <AddProduct userId={session.user?.id} />
    </>
  );
};

export default Page;
