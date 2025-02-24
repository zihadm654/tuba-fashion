import { getProductByCat } from "@/actions/product";

import BreadcrumbSection from "@/components/layout/breadcrumb-section";
import { ProductCard } from "@/components/sections/products";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const CATEGORIES = {
  MEN: "men",
  WOMEN: "women",
  KIDS: "kids",
} as const;

type Category = (typeof CATEGORIES)[keyof typeof CATEGORIES];
const page = async ({ params }: { params: Promise<{ cat: string }> }) => {
  const cat = (await params).cat;
  const res = await getProductByCat(cat as Category);
  const products = res.data;
  if (!res && products) return <div>Loading...</div>;
  return (
    <section className="py-2">
      <MaxWidthWrapper>
        <BreadcrumbSection end={cat} />
        <h1 className="pt-2 text-2xl capitalize">Featured Category: {cat}</h1>
        <section className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      </MaxWidthWrapper>
    </section>
  );
};

export default page;
