import { Suspense } from "react";

import Products from "@/components/sections/products";

const page = async () => {
  const res = await fetch("https://fakestoreapi.com/products");
  const products = await res.json();
  console.log(products);
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Products products={products} />
      </Suspense>
    </div>
  );
};

export default page;
