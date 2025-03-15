import { getBrands } from "@/actions/brand";
import { getCategories } from "@/actions/category";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";
import { DashboardHeader } from "@/components/dashboard/header";
import { AddProduct } from "@/components/forms/add-product";

const Page = async () => {
  const session = await auth();

  if (!session || !session.user?.id) {
    return null;
  }

  const { data: categories, success } = await getCategories();
  const brands = await getBrands();

  return (
    <>
      <DashboardHeader heading="Add project" text="Create new project" />
      <AddProduct
        userId={session.user?.id}
        categories={
          success && categories
            ? categories.map((cat) => ({
                id: cat.id,
                title: cat.title,
                description: cat.description,
                createdAt: cat.createdAt,
                updatedAt: cat.updatedAt,
              }))
            : []
        }
        brands={brands.data ?? []}
      />
    </>
  );
};

export default Page;
