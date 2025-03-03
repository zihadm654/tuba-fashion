import { Suspense } from "react";
import { getProducts } from "@/actions/product";

import { constructMetadata } from "@/lib/utils";
import BreadcrumbSection from "@/components/layout/breadcrumb-section";
import Products from "@/components/sections/products";
import { SkeletonSection } from "@/components/shared/section-skeleton";

export const metadata = constructMetadata({
  title: "Products - Tuba Fasion",
  description: "Lists of products.",
});
const page = async () => {
  const products = await getProducts();
  console.log(products);
  return (
    <>
      <BreadcrumbSection end="products" />
      <Suspense fallback={<SkeletonSection />}>
        <Products products={products?.data ?? []} title="All Products" />
      </Suspense>
    </>
  );
};

export default page;
