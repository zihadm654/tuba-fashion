import { getBrands } from "@/actions/brand";
import { getCategories } from "@/actions/category";
import { getProduct } from "@/actions/product";

import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { AddProduct } from "@/components/forms/add-product";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const currentUser = await getCurrentUser();
  if (!currentUser || !currentUser?.id) {
    return null; // or redirect to login  // Fix this
  }
  const product = await getProduct(id);
  if (product.success === false) return null;
  const categories = await getCategories();
  if (categories.success === false) return null;
  const brands = await getBrands();

  return (
    <>
      <DashboardHeader
        heading={product ? "Edit Product" : "Add Product"}
        text={product ? "Edit product data" : "Create new product"}
      />
      <AddProduct
        product={product.data}
        userId={currentUser?.id}
        categories={categories.data ?? []}
        brands={brands.data ?? []}
      />
    </>
  );
};

export default Page;
