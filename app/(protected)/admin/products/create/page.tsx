import React from "react";

import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { AddProduct } from "@/components/forms/add-product";

const Page = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.id) {
    return null; // or redirect to login
  }

  return (
    <>
      <DashboardHeader heading="Add project" text="Create new project" />
      <AddProduct userId={currentUser.id} />
    </>
  );
};

export default Page;
