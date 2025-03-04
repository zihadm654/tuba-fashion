"use client";

import { useEffect, useState } from "react";
import { getProducts } from "@/actions/product";
import { Product } from "@prisma/client";

import ProductFilters from "@/components/sections/product-filters";
import Products from "@/components/sections/products";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const Client = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts({});
      const productsData = allProducts?.data ?? [];
      setProducts(productsData as Product[]);
    };
    fetchProducts();
  }, []);

  return (
    <div className="pt-4">
      <MaxWidthWrapper>
        <ProductFilters
          onFiltersChange={async (filters) => {
            const filteredProducts = await getProducts(filters);
            const productsData = filteredProducts?.data ?? [];
            setProducts(productsData as Product[]); // Type assertion to Product[]
            return filteredProducts;
          }}
        />
        <Products products={products} title="All Products" />
      </MaxWidthWrapper>
    </div>
  );
};

export default Client;
