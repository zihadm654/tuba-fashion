import { Suspense } from "react";
import { getCategories } from "@/actions/category";
import { getProducts } from "@/actions/product";

import { infos } from "@/config/landing";
import { prisma } from "@/lib/db";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import BentoGrid from "@/components/sections/bentogrid";
import { CategoriesSelection } from "@/components/sections/category-section";
import Features from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Products from "@/components/sections/products";
import Testimonials from "@/components/sections/testimonials";
import { SkeletonSection } from "@/components/shared/section-skeleton";

export default async function IndexPage() {
  const products = await getProducts();
  const categories = await getCategories();
  if (products.success === false) return <div>products not found</div>;
  if (categories.success === false) return <div>products not found</div>;
  console.log(products, "data");
  return (
    <>
      <Hero />
      <Suspense fallback={<SkeletonSection />}>
        <Products
          products={products?.data ?? []}
          title="Featured Products"
          link="products"
          name="All Products"
        />
      </Suspense>
      <Suspense fallback={<SkeletonSection />}>
        <CategoriesSelection categories={categories.data ?? []} />
      </Suspense>
      {/* <PricingFaq /> */}
      {/* <HeroLanding />
      <PreviewLanding />
      <Powered />
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      <Features />
      <Testimonials /> */}
    </>
  );
}
