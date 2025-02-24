import { Suspense } from "react";
import { getProducts } from "@/actions/product";

import BreadcrumbSection from "@/components/layout/breadcrumb-section";
import Products from "@/components/sections/products";
import { SkeletonSection } from "@/components/shared/section-skeleton";

const page = async () => {
  const products = await getProducts();
  console.log(products);
  return (
    <>
      <BreadcrumbSection end="products" />
      <Suspense fallback={<SkeletonSection />}>
        <Products products={products?.data ?? []} />
      </Suspense>
    </>
  );
};

export default page;
