import { Suspense } from "react";

import { infos } from "@/config/landing";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Products from "@/components/sections/products";
import Testimonials from "@/components/sections/testimonials";

export default async function IndexPage() {
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();
  console.log(products);
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Products products={products} />
      </Suspense>
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
