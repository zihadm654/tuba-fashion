import { Suspense } from "react";
import { getProducts } from "@/actions/product";

import BreadcrumbSection from "@/components/layout/breadcrumb-section";
import Products from "@/components/sections/products";
import { SkeletonSection } from "@/components/shared/section-skeleton";

const page = async () => {
  const products = await getProducts();
  console.log(products);
  return (
    <div className="container mx-auto px-4">
      <BreadcrumbSection end="Products" />
      <h1 className="text-2xl capitalize">Featured Products</h1>
      <Suspense fallback={<SkeletonSection />}>
        <Products products={products?.data ?? []} />
      </Suspense>
    </div>
  );
};

export default page;
