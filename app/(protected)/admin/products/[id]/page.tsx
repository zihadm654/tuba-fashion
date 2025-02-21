import { getProduct } from "@/actions/product";

import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { AddProduct } from "@/components/forms/add-product";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser.id) {
    return null; // or redirect to login  // Fix this
  }
  const product = await getProduct(id);
  return (
    <>
      <DashboardHeader heading="Add project" text="Create new project" />
      <AddProduct product={product.data} userId={currentUser?.id} />
    </>
  );
};

export default Page;
